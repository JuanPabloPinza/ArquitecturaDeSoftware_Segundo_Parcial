namespace API_DOTNET_BANK.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = default!;
        public UserInfoDto User { get; set; } = default!;
    }

    public class UserInfoDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string Email { get; set; } = default!;
        public bool IsActive { get; set; }
        public int Role { get; set; }
    }
}
