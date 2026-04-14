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

        [HttpGet("{id}/puzzles")]
        public async Task<IActionResult> GetUserPuzzles(int id)
        {
            var puzzles = await _context.Puzzles
                .Include(p => p.Photo)
                .Where(p => p.UserId == id)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    puzzleId = p.Id,
                    photoId = p.PhotoId,
                    difficulty = p.Difficulty.ToString(),
                    pieceCount = p.PieceCount,
                    status = p.Status.ToString(),
                    originalFilename = p.Photo.OriginalFilename,
                    filePath = p.Photo.FilePath,
                    createdAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(puzzles);
        }
    }
}