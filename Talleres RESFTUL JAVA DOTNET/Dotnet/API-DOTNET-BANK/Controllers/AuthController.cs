using API_DOTNET_BANK.Application.DTOs.Auth;
using API_DOTNET_BANK.Application.Interface;
using API_DOTNET_BANK.Application.Service;
using API_DOTNET_BANK.Infraestructure;
using API_DOTNET_BANK.Infraestructure.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API_DOTNET_BANK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AuthController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private IAuthService CreateService()
        {
            var userRepository = new UserRepository(_dbContext);
            return new AuthService(userRepository);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            try
            {
                var result = await CreateService().RegisterAsync(dto);
                if (result == null)
                    return BadRequest("El usuario o email ya existe");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var result = await CreateService().LoginAsync(dto);
            if (result == null)
                return Unauthorized("Credenciales inválidas");

            return Ok(result);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyUser()
        {
            Console.WriteLine("Obteniendo claims del usuario autenticado...");
            
    
            var userIdClaim = User.FindFirst("UserId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim is null)
                return Unauthorized("Token inválido.");

            if (!int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("ID de usuario inválido en el token.");

            var result = await CreateService().GetMeAsync(userId);
            if (result is null)
                return NotFound("Usuario no encontrado.");

            return Ok(result);
        }
    }
}
