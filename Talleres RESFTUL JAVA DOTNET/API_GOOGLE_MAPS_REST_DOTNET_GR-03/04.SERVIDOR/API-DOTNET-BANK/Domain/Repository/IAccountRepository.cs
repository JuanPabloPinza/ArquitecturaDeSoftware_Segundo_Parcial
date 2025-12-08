using API_DOTNET_BANK.Domain.Entities;

namespace API_DOTNET_BANK.Domain.Repository
{
    public interface IAccountRepository
    {
        Task<Account?> GetByIdAsync(int id);
        Task<Account?> GetByAccountNumberAsync(string accountNumber);
        Task<IEnumerable<Account>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Account>> GetAllAsync();
        Task<Account> CreateAsync(Account account);
        Task<Account> UpdateAsync(Account account);
        Task<bool> DeleteAsync(int id);
    }
}
