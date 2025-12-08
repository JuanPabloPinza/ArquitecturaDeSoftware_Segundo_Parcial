using API_DOTNET_BANK.Domain.Enums;

namespace API_DOTNET_BANK.Domain.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public TransactionType TransactionType { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public int AccountId { get; set; }
        public Account Account { get; set; } = default!;
        public int? DestinationAccountId { get; set; }
        public Account? DestinationAccount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
