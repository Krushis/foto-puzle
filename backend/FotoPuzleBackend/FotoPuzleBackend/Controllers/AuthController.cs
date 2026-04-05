using FotoPuzleBackend.Data;
using FotoPuzleBackend.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FotoPuzleBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            _logger.LogInformation("Login attempt for email: {Email}", loginDto.Email);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || user.PasswordHash != loginDto.Password)
            {
                _logger.LogWarning("Failed login attempt for email: {Email}", loginDto.Email);
                return Unauthorized(new { message = "Neteisingas el. paštas arba slaptažodis" });
            }

            _logger.LogInformation("User {UserId} ({Email}) logged in successfully", user.Id, user.Email);
            return Ok(new
            {
                message = "Prisijungimas sėkmingas",
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    username = user.Username
                }
            });
        }
    }
}