using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using FotoPuzleBackend.Models.DTO;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> Create([FromForm] CreatePuzzleDTO dto)
        {
            try
            {
                var user = await _context.Users.FindAsync(dto.UserId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                if (dto.Image == null || dto.Image.Length == 0)
                {
                    return BadRequest(new { message = "Image is required" });
                }

                var uploadsFolder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                Directory.CreateDirectory(uploadsFolder);

                var extension = Path.GetExtension(dto.Image.FileName);
                if (string.IsNullOrWhiteSpace(extension))
                {
                    extension = ".jpg";
                }

                var storedFilename = $"{Guid.NewGuid()}{extension}";
                var physicalPath = Path.Combine(uploadsFolder, storedFilename);

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                var photo = new Photo
                {
                    UserId = dto.UserId,
                    OriginalFilename = string.IsNullOrWhiteSpace(dto.OriginalFilename)
                        ? dto.Image.FileName
                        : dto.OriginalFilename,
                    StoredFilename = storedFilename,
                    FilePath = $"/uploads/{storedFilename}",
                    FileSizeBytes = dto.Image.Length,
                    MimeType = dto.Image.ContentType,
                    Status = PhotoStatus.Ready,
                    UploadedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    IsPublic = dto.IsPublic
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
                    CreatedAt = DateTime.UtcNow,
                    AspectRatio = dto.AspectRatio
                };

                _context.Puzzles.Add(puzzle);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = puzzle.Id,
                    puzzleId = puzzle.Id,
                    userId = puzzle.UserId,
                    photoId = photo.Id,
                    pieceCount = puzzle.PieceCount,
                    aspectRatio = puzzle.AspectRatio,
                    filePath = photo.FilePath,
                    originalFilename = photo.OriginalFilename,
                    createdAt = puzzle.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create puzzle for user {UserId}", dto.UserId);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}/public")]
        public async Task<IActionResult> MakePublic(int id)
        {
            var puzzle = await _context.Puzzles
                .Include(p => p.Photo)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (puzzle == null)
            {
                return NotFound(new { message = "Puzzle not found" });
            }

            puzzle.Photo.IsPublic = true;
            puzzle.Photo.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Dėlionė įkelta į galeriją." });
        }

        [HttpGet("public")]
        public async Task<IActionResult> GetPublicPuzzles([FromQuery] int? userId)
        {
            var puzzles = await _context.Puzzles
                .Include(p => p.Photo)
                .Include(p => p.User)
                .Where(p => p.Photo.IsPublic)
                .Select(p => new
                {
                    puzzleId = p.Id,
                    id = p.Id,
                    username = p.User.Username,
                    pieceCount = p.PieceCount,
                    aspectRatio = p.AspectRatio,
                    filePath = p.Photo.FilePath,
                    originalFilename = p.Photo.OriginalFilename,
                    createdAt = p.CreatedAt,

                    likesCount = _context.PuzzleLikes
                        .Count(pl => pl.PuzzleId == p.Id),

                    isLikedByCurrentUser = userId.HasValue &&
                        _context.PuzzleLikes
                            .Any(pl => pl.PuzzleId == p.Id && pl.UserId == userId.Value)
                })
                .OrderByDescending(p => p.likesCount)
                .ThenByDescending(p => p.createdAt)
                .ToListAsync();

            return Ok(puzzles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPuzzle(int id)
        {
            var puzzle = await _context.Puzzles
                .Include(p => p.Photo)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    puzzleId = p.Id,
                    id = p.Id,
                    photoId = p.PhotoId,
                    userId = p.UserId,
                    pieceCount = p.PieceCount,
                    aspectRatio = p.AspectRatio,
                    filePath = p.Photo.FilePath,
                    originalFilename = p.Photo.OriginalFilename,
                    status = p.Status.ToString(),

                    likesCount = _context.PuzzleLikes
                        .Count(pl => pl.PuzzleId == p.Id)
                })
                .FirstOrDefaultAsync();

            if (puzzle == null)
            {
                return NotFound(new { message = "Puzzle not found" });
            }

            return Ok(puzzle);
        }
    }
}