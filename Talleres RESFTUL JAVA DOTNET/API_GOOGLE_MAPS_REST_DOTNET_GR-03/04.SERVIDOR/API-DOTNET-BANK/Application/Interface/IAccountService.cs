using API_DOTNET_BANK.Application.DTOs.Account;

namespace API_DOTNET_BANK.Application.Interface
{
    public interface IAccountService
    {
        Task<AccountDto?> GetByIdAsync(int id);
        Task<IEnumerable<AccountDto>> GetByUserIdAsync(int userId);
        Task<IEnumerable<AccountDto>> GetAllAsync();
        Task<AccountDto?> CreateAsync(CreateAccountDto dto);
        Task<AccountDto?> UpdateAsync(int id, UpdateAccountDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
