using API_DOTNET_BANK.Domain.Enums;

namespace API_DOTNET_BANK.Domain.Entities
{
    public class Account
    {
        public int Id { get; set; }
        public string AccountNumber { get; set; } = default!;
        public AccountType AccountType { get; set; }
        public decimal Balance { get; set; }
        public bool IsActive { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
