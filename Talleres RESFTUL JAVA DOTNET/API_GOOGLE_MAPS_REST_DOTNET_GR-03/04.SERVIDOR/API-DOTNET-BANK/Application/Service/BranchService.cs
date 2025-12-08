using API_DOTNET_BANK.Application.DTOs.Branch;
using API_DOTNET_BANK.Application.Interface;
using API_DOTNET_BANK.Domain.Entities;
using API_DOTNET_BANK.Domain.Repository;

namespace API_DOTNET_BANK.Application.Service
{
    public class BranchService : IBranchService
    {
        private readonly IBranchRepository _branchRepository;

        public BranchService(IBranchRepository branchRepository)
        {
            _branchRepository = branchRepository;
        }

        public async Task<BranchDto?> GetByIdAsync(int id)
        {
            var branch = await _branchRepository.GetByIdAsync(id);
            return branch != null ? ToDto(branch) : null;
        }

        public async Task<IEnumerable<BranchDto>> GetAllAsync()
        {
            var branches = await _branchRepository.GetAllAsync();
            return branches.Select(ToDto);
        }

        public async Task<BranchDto> CreateAsync(CreateBranchDto dto)
        {
            var branch = new Branch
            {
                Name = dto.Name,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            };

            var created = await _branchRepository.CreateAsync(branch);
            return ToDto(created);
        }

        public async Task<BranchDto?> UpdateAsync(int id, UpdateBranchDto dto)
        {
            var branch = await _branchRepository.GetByIdAsync(id);
            if (branch == null) return null;

            branch.Name = dto.Name;
            branch.Latitude = dto.Latitude;
            branch.Longitude = dto.Longitude;
            branch.PhoneNumber = dto.PhoneNumber;
            branch.Email = dto.Email;
            branch.IsActive = dto.IsActive;

            var updated = await _branchRepository.UpdateAsync(branch);
            return ToDto(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _branchRepository.DeleteAsync(id);
        }

        private static BranchDto ToDto(Branch branch) => new()
        {
            Id = branch.Id,
            Name = branch.Name,
            Latitude = branch.Latitude,
            Longitude = branch.Longitude,
            PhoneNumber = branch.PhoneNumber,
            Email = branch.Email,
            IsActive = branch.IsActive,
            CreatedAt = branch.CreatedAt,
            UpdatedAt = branch.UpdatedAt
        };
    }
}
