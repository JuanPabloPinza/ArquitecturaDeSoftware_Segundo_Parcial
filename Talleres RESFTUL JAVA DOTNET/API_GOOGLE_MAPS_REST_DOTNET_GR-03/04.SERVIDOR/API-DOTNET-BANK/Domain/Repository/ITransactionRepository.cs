using API_DOTNET_BANK.Domain.Entities;

namespace API_DOTNET_BANK.Domain.Repository
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByIdAsync(int id);
        Task<IEnumerable<Transaction>> GetByAccountIdAsync(int accountId);
        Task<IEnumerable<Transaction>> GetAllAsync();
        Task<Transaction> CreateAsync(Transaction transaction);
    }
}
