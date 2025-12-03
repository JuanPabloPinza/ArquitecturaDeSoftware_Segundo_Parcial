using API_DOTNET_BANK.Application.DTOs.Auth;

namespace API_DOTNET_BANK.Application.Interface
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(UserRegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto);
        Task<UserDto?> GetUserByIdAsync(int userId);
    }
}
