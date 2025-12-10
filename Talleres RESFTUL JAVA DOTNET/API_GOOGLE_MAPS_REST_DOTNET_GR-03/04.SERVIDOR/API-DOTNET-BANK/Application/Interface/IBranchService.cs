using API_DOTNET_BANK.Application.DTOs.Branch;

namespace API_DOTNET_BANK.Application.Interface
{
    public interface IBranchService
    {
        Task<BranchDto?> GetByIdAsync(int id);
        Task<IEnumerable<BranchDto>> GetAllAsync();
        Task<BranchDto> CreateAsync(CreateBranchDto dto);
        Task<BranchDto?> UpdateAsync(int id, UpdateBranchDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
