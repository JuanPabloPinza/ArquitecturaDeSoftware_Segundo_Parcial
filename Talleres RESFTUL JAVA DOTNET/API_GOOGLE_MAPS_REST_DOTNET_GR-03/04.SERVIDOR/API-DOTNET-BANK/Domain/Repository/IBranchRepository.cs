using API_DOTNET_BANK.Domain.Entities;

namespace API_DOTNET_BANK.Domain.Repository
{
    public interface IBranchRepository
    {
        Task<Branch?> GetByIdAsync(int id);
        Task<IEnumerable<Branch>> GetAllAsync();
        Task<Branch> CreateAsync(Branch branch);
        Task<Branch> UpdateAsync(Branch branch);
        Task<bool> DeleteAsync(int id);
    }
}
