namespace API_DOTNET_BANK.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public required bool IsActive { get; set; }
        public required UserRole Role { get; set; }
        
        public ICollection<Account> Accounts { get; set; } = new List<Account>();
    }

    public enum UserRole
    {
        Administrator = 0,
        Finance = 1,
        Manager = 2,
        User = 3,
    }
}
