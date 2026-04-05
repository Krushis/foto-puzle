using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FotoPuzleBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserController> _logger;

        public UserController(AppDbContext context, ILogger<UserController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET api/user/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileDTO>> GetProfile(int id)
        {
            _logger.LogInformation("Profile request for user {UserId}", id);

            var user = await _context.Users
                .Include(u => u.Photos)
                .Include(u => u.Puzzles)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                _logger.LogWarning("User {UserId} not found", id);
                return NotFound($"User with id {id} was not found.");
            }

            _logger.LogInformation("Returning profile for user {UserId} ({Username})", user.Id, user.Username);
            var profile = new UserProfileDTO
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                TotalPhotos = user.Photos.Count,
                TotalPuzzles = user.Puzzles.Count
            };

            return Ok(profile);
        }
    }
}
