using API_DOTNET_BANK.Domain.Entities;

namespace API_DOTNET_BANK.Application.DTOs.Auth
{
    public class UserRegisterDto
    {
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public required string Username { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }

    public sealed record UserDto(
        int Id,
        string FirstName,
        string LastName,
        string Email,
        string Username,
        bool IsActive,
        UserRole Role
    );
}
