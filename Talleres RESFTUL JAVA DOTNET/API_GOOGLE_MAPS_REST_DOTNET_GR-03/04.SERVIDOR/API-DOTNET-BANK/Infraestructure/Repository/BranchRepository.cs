using API_DOTNET_BANK.Domain.Entities;
using API_DOTNET_BANK.Domain.Repository;
using Microsoft.EntityFrameworkCore;

namespace API_DOTNET_BANK.Infraestructure.Repository
{
    public class BranchRepository : IBranchRepository
    {
        private readonly AppDbContext _context;

        public BranchRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Branch?> GetByIdAsync(int id)
        {
            return await _context.Branches.FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<IEnumerable<Branch>> GetAllAsync()
        {
            return await _context.Branches.ToListAsync();
        }

        public async Task<Branch> CreateAsync(Branch branch)
        {
            _context.Branches.Add(branch);
            await _context.SaveChangesAsync();
            return branch;
        }

        public async Task<Branch> UpdateAsync(Branch branch)
        {
            branch.UpdatedAt = DateTime.UtcNow;
            _context.Branches.Update(branch);
            await _context.SaveChangesAsync();
            return branch;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null) return false;
            
            _context.Branches.Remove(branch);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
