using API_DOTNET_BANK.Application.DTOs.Account;
using API_DOTNET_BANK.Application.Interface;
using API_DOTNET_BANK.Domain.Entities;
using API_DOTNET_BANK.Domain.Enums;
using API_DOTNET_BANK.Domain.Repository;

namespace API_DOTNET_BANK.Application.Service
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IUserRepository _userRepository;

        public AccountService(IAccountRepository accountRepository, IUserRepository userRepository)
        {
            _accountRepository = accountRepository;
            _userRepository = userRepository;
        }

        public async Task<AccountDto?> GetByIdAsync(int id)
        {
            var account = await _accountRepository.GetByIdAsync(id);
            return account != null ? ToDto(account) : null;
        }

        public async Task<IEnumerable<AccountDto>> GetByUserIdAsync(int userId)
        {
            var accounts = await _accountRepository.GetByUserIdAsync(userId);
            return accounts.Select(ToDto);
        }

        public async Task<IEnumerable<AccountDto>> GetAllAsync()
        {
            var accounts = await _accountRepository.GetAllAsync();
            return accounts.Select(ToDto);
        }

        public async Task<AccountDto?> CreateAsync(CreateAccountDto dto)
        {
            var user = await _userRepository.GetByIdAsync(dto.UserId);
            if (user == null) return null;

            var accountNumber = GenerateAccountNumber();
            
            var account = new Account
            {
                AccountNumber = accountNumber,
                AccountType = (AccountType)dto.AccountType,
                Balance = dto.InitialBalance,
                IsActive = true,
                UserId = dto.UserId,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _accountRepository.CreateAsync(account);
            created.User = user;
            return ToDto(created);
        }

        public async Task<AccountDto?> UpdateAsync(int id, UpdateAccountDto dto)
        {
            var account = await _accountRepository.GetByIdAsync(id);
            if (account == null) return null;

            account.IsActive = dto.IsActive;
            var updated = await _accountRepository.UpdateAsync(account);
            return ToDto(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _accountRepository.DeleteAsync(id);
        }

        private static string GenerateAccountNumber()
        {
            var random = new Random();
            return $"{random.Next(1000, 9999)}-{random.Next(1000, 9999)}-{random.Next(1000, 9999)}";
        }

        private static AccountDto ToDto(Account account) => new()
        {
            Id = account.Id,
            AccountNumber = account.AccountNumber,
            AccountType = (int)account.AccountType,
            Balance = account.Balance,
            IsActive = account.IsActive,
            UserId = account.UserId,
            UserFullName = account.User != null ? $"{account.User.FirstName} {account.User.LastName}" : "",
            CreatedAt = account.CreatedAt,
            UpdatedAt = account.UpdatedAt
        };
    }
}
