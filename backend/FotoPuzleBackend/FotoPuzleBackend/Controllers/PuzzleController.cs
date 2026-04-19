using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FotoPuzleBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PuzzleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PuzzleController> _logger;

        public PuzzleController(AppDbContext context, ILogger<PuzzleController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreatePuzzleDTO dto)
        {
            try
            {
                var user = await _context.Users.FindAsync(dto.UserId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var storedFilename = $"{Guid.NewGuid()}.jpg";

                var photo = new Photo
                {
                    UserId = dto.UserId,
                    OriginalFilename = string.IsNullOrWhiteSpace(dto.OriginalFilename)
                        ? "uploaded-image.jpg"
                        : dto.OriginalFilename,
                    StoredFilename = storedFilename,
                    FilePath = $"/uploads/{storedFilename}",
                    MimeType = "image/jpeg",
                    Status = PhotoStatus.Ready,
                    UploadedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Photos.Add(photo);
                await _context.SaveChangesAsync();

                var puzzle = new Puzzle
                {
                    UserId = dto.UserId,
                    PhotoId = photo.Id,
                    PieceCount = dto.PieceCount,
                    Difficulty = DifficultyLevel.Medium,
                    Status = PuzzleStatus.Ready,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Puzzles.Add(puzzle);
                await _context.SaveChangesAsync();

                _logger.LogInformation(
                    "Created puzzle {PuzzleId} with photo {PhotoId} for user {UserId}",
                    puzzle.Id, photo.Id, dto.UserId
                );

                return Ok(new
                {
                    id = puzzle.Id,
                    userId = puzzle.UserId,
                    photoId = photo.Id,
                    pieceCount = puzzle.PieceCount,
                    createdAt = puzzle.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create puzzle for user {UserId}", dto.UserId);
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

    /// <summary>
    /// Siaip nx mes dedam sita i controlleri kai jau yra DTO folderis? :DDD
    /// </summary>
    public class CreatePuzzleDTO
    {
        public int UserId { get; set; }
        public int PieceCount { get; set; }
        public string? OriginalFilename { get; set; }
    }
}