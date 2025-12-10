namespace API_DOTNET_BANK.Application.DTOs.Transaction
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public int TransactionType { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public int AccountId { get; set; }
        public string AccountNumber { get; set; } = default!;
        public int? DestinationAccountId { get; set; }
        public string? DestinationAccountNumber { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateDepositDto
    {
        public int AccountId { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
    }

    public class CreateWithdrawalDto
    {
        public int AccountId { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
    }

    public class CreateTransferDto
    {
        public int SourceAccountId { get; set; }
        public int DestinationAccountId { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
    }
}
