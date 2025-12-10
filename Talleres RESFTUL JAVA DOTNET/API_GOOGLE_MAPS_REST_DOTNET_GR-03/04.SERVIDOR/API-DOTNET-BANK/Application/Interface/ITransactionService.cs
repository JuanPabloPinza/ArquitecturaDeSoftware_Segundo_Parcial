using API_DOTNET_BANK.Application.DTOs.Transaction;

namespace API_DOTNET_BANK.Application.Interface
{
    public interface ITransactionService
    {
        Task<TransactionDto?> GetByIdAsync(int id);
        Task<IEnumerable<TransactionDto>> GetByAccountIdAsync(int accountId);
        Task<IEnumerable<TransactionDto>> GetAllAsync();
        Task<TransactionDto?> DepositAsync(CreateDepositDto dto);
        Task<TransactionDto?> WithdrawAsync(CreateWithdrawalDto dto);
        Task<TransactionDto?> TransferAsync(CreateTransferDto dto);
    }
}
