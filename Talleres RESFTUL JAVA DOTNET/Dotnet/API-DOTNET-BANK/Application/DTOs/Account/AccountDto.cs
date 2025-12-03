namespace API_DOTNET_BANK.Application.DTOs.Account
{
    public class AccountDto
    {
        public int Id { get; set; }
        public string AccountNumber { get; set; } = default!;
        public int AccountType { get; set; }
        public decimal Balance { get; set; }
        public bool IsActive { get; set; }
        public int UserId { get; set; }
        public string UserFullName { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateAccountDto
    {
        public int AccountType { get; set; }
        public decimal InitialBalance { get; set; }
        public int UserId { get; set; }
    }

    public class UpdateAccountDto
    {
        public bool IsActive { get; set; }
    }
}
