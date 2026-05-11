using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FotoPuzleBackend.Controllers
{
    [ApiController]
    [Route("api/puzzle-like")]
    public class PuzzleLikeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PuzzleLikeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{puzzleId}")]
        public async Task<IActionResult> LikePuzzle(int puzzleId, [FromBody] LikeRequest request)
        {
            var puzzleExists = await _context.Puzzles.AnyAsync(p => p.Id == puzzleId);

            if (!puzzleExists)
                return NotFound(new { message = "Puzzle not found" });

            var alreadyLiked = await _context.PuzzleLikes.AnyAsync(x =>
                x.PuzzleId == puzzleId && x.UserId == request.UserId);

            if (alreadyLiked)
                return BadRequest(new { message = "Already liked" });

            var like = new PuzzleLike
            {
                PuzzleId = puzzleId,
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.PuzzleLikes.Add(like);
            await _context.SaveChangesAsync();

            var likesCount = await _context.PuzzleLikes.CountAsync(x => x.PuzzleId == puzzleId);

            return Ok(new { message = "Liked", likesCount });
        }

        [HttpDelete("{puzzleId}/{userId}")]
        public async Task<IActionResult> UnlikePuzzle(int puzzleId, int userId)
        {
            var like = await _context.PuzzleLikes.FirstOrDefaultAsync(x =>
                x.PuzzleId == puzzleId && x.UserId == userId);

            if (like == null)
                return NotFound(new { message = "Like not found" });

            _context.PuzzleLikes.Remove(like);
            await _context.SaveChangesAsync();

            var likesCount = await _context.PuzzleLikes.CountAsync(x => x.PuzzleId == puzzleId);

            return Ok(new { message = "Unliked", likesCount });
        }
    }

    public class LikeRequest
    {
        public int UserId { get; set; }
    }
}