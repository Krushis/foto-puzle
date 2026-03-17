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

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || user.PasswordHash != loginDto.Password)
                return Unauthorized(new { message = "Neteisingas el. paštas arba slaptažodis" });

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