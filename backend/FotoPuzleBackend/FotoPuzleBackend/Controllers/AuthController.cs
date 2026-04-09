using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.DTO;
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

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
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
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            try
            {
                var exists = await _context.Users.AnyAsync(u =>
                    u.Email == dto.Email || u.Username == dto.Username);

                if (exists)
                    return BadRequest("User already exists");

                var user = new Models.Entities.User
                {
                    Email = dto.Email.ToLower(),
                    Username = dto.Username,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Registracija sėkminga" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Register");
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}