using API_DOTNET_BANK.Application.DTOs.Auth;
using API_DOTNET_BANK.Application.Interface;
using API_DOTNET_BANK.Application.Utils;
using API_DOTNET_BANK.Domain.Entities;
using API_DOTNET_BANK.Domain.Repository;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace API_DOTNET_BANK.Application.Service
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto)
        {
            var user = await _userRepository.GetByUsernameOrEmailAsync(dto.Email);

            if (user is null || !user.IsActive || user.PasswordHash != PasswordHasher.HashPassword(dto.Password))
                return null;

            return new AuthResponseDto
            {
                AccessToken = GenerateAccessToken(user)
            };
        }

        public async Task<AuthResponseDto?> RegisterAsync(UserRegisterDto dto)
        {
            // Verificar si ya existe usuario con ese username o email
            var existingUser = await _userRepository.GetByUsernameOrEmailAsync(dto.Username);
            if (existingUser != null)
                return null;

            existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                return null;

            var newUser = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                Role = UserRole.User,
            };

            var createdUser = await _userRepository.CreateAsync(newUser);

            return new AuthResponseDto
            {
                AccessToken = GenerateAccessToken(createdUser)
            };
        }

        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user?.ToDto();
        }

        public async Task<UserDto?> GetMeAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user?.ToDto();
        }

        private static string ResolveRoleName(UserRole role) =>
            (int)role switch
            {
                0 => "Administrator",
                1 => "Finance",
                2 => "Manager",
                3 => "User",
                _ => role.ToString(),
            };

        private string GenerateAccessToken(User user)
        {
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")!;
            var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")!;
            var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")!;

            var roleName = ResolveRoleName(user.Role);

            var claims = new List<Claim>
            {
                new("UserId", user.Id.ToString()),
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Name, user.Username),
                new(ClaimTypes.GivenName, user.FirstName),
                new(ClaimTypes.Surname, user.LastName),
                new(ClaimTypes.Role, roleName),
                new(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
