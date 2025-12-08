using API_DOTNET_BANK.Application.DTOs.Transaction;
using API_DOTNET_BANK.Application.Interface;
using API_DOTNET_BANK.Domain.Entities;
using API_DOTNET_BANK.Domain.Enums;
using API_DOTNET_BANK.Domain.Repository;

namespace API_DOTNET_BANK.Application.Service
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IAccountRepository _accountRepository;

        public TransactionService(ITransactionRepository transactionRepository, IAccountRepository accountRepository)
        {
            _transactionRepository = transactionRepository;
            _accountRepository = accountRepository;
        }

        public async Task<TransactionDto?> GetByIdAsync(int id)
        {
            var transaction = await _transactionRepository.GetByIdAsync(id);
            return transaction != null ? ToDto(transaction) : null;
        }

        public async Task<IEnumerable<TransactionDto>> GetByAccountIdAsync(int accountId)
        {
            var transactions = await _transactionRepository.GetByAccountIdAsync(accountId);
            return transactions.Select(ToDto);
        }

        public async Task<IEnumerable<TransactionDto>> GetAllAsync()
        {
            var transactions = await _transactionRepository.GetAllAsync();
            return transactions.Select(ToDto);
        }

        public async Task<TransactionDto?> DepositAsync(CreateDepositDto dto)
        {
            var account = await _accountRepository.GetByIdAsync(dto.AccountId);
            if (account == null || !account.IsActive) return null;

            account.Balance += dto.Amount;
            await _accountRepository.UpdateAsync(account);

            var transaction = new Transaction
            {
                TransactionType = TransactionType.Deposit,
                Amount = dto.Amount,
                Description = dto.Description ?? "Depósito",
                AccountId = dto.AccountId,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _transactionRepository.CreateAsync(transaction);
            created.Account = account;
            return ToDto(created);
        }

        public async Task<TransactionDto?> WithdrawAsync(CreateWithdrawalDto dto)
        {
            var account = await _accountRepository.GetByIdAsync(dto.AccountId);
            if (account == null || !account.IsActive) return null;
            if (account.Balance < dto.Amount) return null;

            account.Balance -= dto.Amount;
            await _accountRepository.UpdateAsync(account);

            var transaction = new Transaction
            {
                TransactionType = TransactionType.Withdrawal,
                Amount = dto.Amount,
                Description = dto.Description ?? "Retiro",
                AccountId = dto.AccountId,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _transactionRepository.CreateAsync(transaction);
            created.Account = account;
            return ToDto(created);
        }

        public async Task<TransactionDto?> TransferAsync(CreateTransferDto dto)
        {
            var sourceAccount = await _accountRepository.GetByIdAsync(dto.SourceAccountId);
            var destAccount = await _accountRepository.GetByIdAsync(dto.DestinationAccountId);
            
            if (sourceAccount == null || !sourceAccount.IsActive) return null;
            if (destAccount == null || !destAccount.IsActive) return null;
            if (sourceAccount.Balance < dto.Amount) return null;

            sourceAccount.Balance -= dto.Amount;
            destAccount.Balance += dto.Amount;
            
            await _accountRepository.UpdateAsync(sourceAccount);
            await _accountRepository.UpdateAsync(destAccount);

            var transaction = new Transaction
            {
                TransactionType = TransactionType.Transfer,
                Amount = dto.Amount,
                Description = dto.Description ?? "Transferencia",
                AccountId = dto.SourceAccountId,
                DestinationAccountId = dto.DestinationAccountId,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _transactionRepository.CreateAsync(transaction);
            created.Account = sourceAccount;
            created.DestinationAccount = destAccount;
            return ToDto(created);
        }

        private static TransactionDto ToDto(Transaction transaction) => new()
        {
            Id = transaction.Id,
            TransactionType = (int)transaction.TransactionType,
            Amount = transaction.Amount,
            Description = transaction.Description,
            AccountId = transaction.AccountId,
            AccountNumber = transaction.Account?.AccountNumber ?? "",
            DestinationAccountId = transaction.DestinationAccountId,
            DestinationAccountNumber = transaction.DestinationAccount?.AccountNumber,
            CreatedAt = transaction.CreatedAt
        };
    }
}
