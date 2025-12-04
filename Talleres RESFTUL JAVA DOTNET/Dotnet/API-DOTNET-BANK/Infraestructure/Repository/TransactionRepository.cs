using API_DOTNET_BANK.Domain.Entities;
using API_DOTNET_BANK.Domain.Repository;
using Microsoft.EntityFrameworkCore;

namespace API_DOTNET_BANK.Infraestructure.Repository
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly AppDbContext _context;

        public TransactionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Transaction?> GetByIdAsync(int id)
        {
            return await _context.Transactions
                .Include(t => t.Account)
                .Include(t => t.DestinationAccount)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<Transaction>> GetByAccountIdAsync(int accountId)
        {
            return await _context.Transactions
                .Include(t => t.Account)
                .Include(t => t.DestinationAccount)
                .Where(t => t.AccountId == accountId || t.DestinationAccountId == accountId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> GetAllAsync()
        {
            return await _context.Transactions
                .Include(t => t.Account)
                .Include(t => t.DestinationAccount)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Transaction> CreateAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }
    }
}
