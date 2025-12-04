using API_DOTNET_BANK.Application.DTOs.Account;
using API_DOTNET_BANK.Application.Interface;
using API_DOTNET_BANK.Application.Service;
using API_DOTNET_BANK.Infraestructure;
using API_DOTNET_BANK.Infraestructure.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_DOTNET_BANK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AccountController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private IAccountService CreateService()
        {
            var accountRepository = new AccountRepository(_dbContext);
            var userRepository = new UserRepository(_dbContext);
            return new AccountService(accountRepository, userRepository);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var accounts = await CreateService().GetAllAsync();
            return Ok(accounts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var account = await CreateService().GetByIdAsync(id);
            if (account == null)
                return NotFound("Cuenta no encontrada");
            return Ok(account);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var accounts = await CreateService().GetByUserIdAsync(userId);
            return Ok(accounts);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAccountDto dto)
        {
            var account = await CreateService().CreateAsync(dto);
            if (account == null)
                return BadRequest("No se pudo crear la cuenta. Verifique que el usuario exista.");
            return CreatedAtAction(nameof(GetById), new { id = account.Id }, account);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAccountDto dto)
        {
            var account = await CreateService().UpdateAsync(id, dto);
            if (account == null)
                return NotFound("Cuenta no encontrada");
            return Ok(account);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await CreateService().DeleteAsync(id);
            if (!result)
                return NotFound("Cuenta no encontrada");
            return NoContent();
        }
    }
}
