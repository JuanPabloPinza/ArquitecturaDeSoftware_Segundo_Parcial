using API_DOTNET_BANK.Application.DTOs.Branch;
using API_DOTNET_BANK.Application.Interface;
using API_DOTNET_BANK.Application.Service;
using API_DOTNET_BANK.Infraestructure;
using API_DOTNET_BANK.Infraestructure.Repository;
using Microsoft.AspNetCore.Mvc;

namespace API_DOTNET_BANK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public BranchController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private IBranchService CreateService()
        {
            var branchRepository = new BranchRepository(_dbContext);
            return new BranchService(branchRepository);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var branches = await CreateService().GetAllAsync();
            return Ok(branches);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var branch = await CreateService().GetByIdAsync(id);
            if (branch == null)
                return NotFound("Sucursal no encontrada");
            return Ok(branch);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBranchDto dto)
        {
            var branch = await CreateService().CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = branch.Id }, branch);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBranchDto dto)
        {
            var branch = await CreateService().UpdateAsync(id, dto);
            if (branch == null)
                return NotFound("Sucursal no encontrada");
            return Ok(branch);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await CreateService().DeleteAsync(id);
            if (!result)
                return NotFound("Sucursal no encontrada");
            return NoContent();
        }
    }
}
