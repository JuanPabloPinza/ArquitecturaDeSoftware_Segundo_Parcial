using API_DOTNET_BANK.Domain.Entities;

namespace API_DOTNET_BANK.Application.DTOs.Auth
{
    public static class UserMapper
    {
        public static UserDto ToDto(this User u) =>
            new UserDto(
                u.Id,
                u.FirstName,
                u.LastName,
                u.Email,
                u.Username,
                u.IsActive,
                u.Role
            );
    }
}
