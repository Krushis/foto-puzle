using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.DTO;
using FotoPuzleBackend.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FotoPuzleBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, ILogger<AuthController> logger, IConfiguration config)
        {
            _context = context;
            _logger = logger;
            _config = config;  // jwt
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

            // generate JWT token
            var token = GenerateToken(user.Id, user.Email, user.Username, user.Role);

            _logger.LogInformation("User {UserId} logged in successfully", user.Id);

            return Ok(new
            {
                token,  // add token to response
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
         
            var email = dto.Email.Trim().ToLower();
            var username = dto.Username.Trim();

            var exists = await _context.Users.AnyAsync(u =>
                u.Email == email || u.Username == username);

            if (exists)
                return BadRequest(new { message = "Toks vartotojas jau egzistuoja." });

            var user = new Models.Entities.User
            {
                Email = email,
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registracija sėkminga" });
            
            
        }

        // token generator - siaip bloga praktika sita controlleryje laikyti bet px
        private string GenerateToken(int userId, string email, string username, UserRole role)
        {
            var claims = new[]
            {
                new Claim("userId", userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim("username", username),
                new Claim("role", role.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    double.Parse(_config["Jwt:ExpiryMinutes"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
