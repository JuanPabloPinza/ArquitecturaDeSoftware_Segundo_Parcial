using API_DOTNET_BANK.Application.DTOs.Transaction;
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
    public class TransactionController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public TransactionController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private ITransactionService CreateService()
        {
            var transactionRepository = new TransactionRepository(_dbContext);
            var accountRepository = new AccountRepository(_dbContext);
            return new TransactionService(transactionRepository, accountRepository);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var transactions = await CreateService().GetAllAsync();
            return Ok(transactions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var transaction = await CreateService().GetByIdAsync(id);
            if (transaction == null)
                return NotFound("Transacción no encontrada");
            return Ok(transaction);
        }

        [HttpGet("account/{accountId}")]
        public async Task<IActionResult> GetByAccountId(int accountId)
        {
            var transactions = await CreateService().GetByAccountIdAsync(accountId);
            return Ok(transactions);
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit([FromBody] CreateDepositDto dto)
        {
            var transaction = await CreateService().DepositAsync(dto);
            if (transaction == null)
                return BadRequest("No se pudo realizar el depósito. Verifique que la cuenta exista y esté activa.");
            return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
        }

        [HttpPost("withdrawal")]
        public async Task<IActionResult> Withdraw([FromBody] CreateWithdrawalDto dto)
        {
            var transaction = await CreateService().WithdrawAsync(dto);
            if (transaction == null)
                return BadRequest("No se pudo realizar el retiro. Verifique que la cuenta exista, esté activa y tenga saldo suficiente.");
            return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] CreateTransferDto dto)
        {
            var transaction = await CreateService().TransferAsync(dto);
            if (transaction == null)
                return BadRequest("No se pudo realizar la transferencia. Verifique que ambas cuentas existan, estén activas y la cuenta origen tenga saldo suficiente.");
            return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
        }
    }
}
