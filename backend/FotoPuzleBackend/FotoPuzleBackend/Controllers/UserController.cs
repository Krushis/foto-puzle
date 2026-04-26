using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileDTO>> GetProfile(int id)
        {
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
                return Unauthorized();

            if (authenticatedUserId != id)
                return Forbid();

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

        [Authorize]
        [HttpGet("{id}/puzzles")]
        public async Task<IActionResult> GetUserPuzzles(int id)
        {
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
                return Unauthorized();

            if (authenticatedUserId != id)
                return Forbid();

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

        [Authorize]
        [HttpPut("{id}/password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDTO dto)
        {
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
                return Unauthorized();

            if (authenticatedUserId != id)
                return Forbid();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.CurrentPassword == dto.NewPassword)
                return BadRequest(new { message = "Naujas slaptažodis turi skirtis nuo dabartinio." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return NotFound($"User with id {id} was not found.");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return BadRequest(new { message = "Dabartinis slaptažodis neteisingas." });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("User {UserId} changed password", id);

            return Ok(new { message = "Slaptažodis pakeistas sėkmingai. Prisijunkite iš naujo." });
        }

        /// <summary>
        /// Retrieves the list of orders for the specified user.
        /// </summary>
        /// <remarks>This endpoint requires authentication. Only the authenticated user can access their
        /// own orders; requests for other users' orders will be denied.</remarks>
        /// <param name="id">The unique identifier of the user whose orders are to be retrieved.</param>
        /// <returns>An <see cref="IActionResult"/> containing a list of the user's orders if the request is authorized;
        /// otherwise, an appropriate error response such as Unauthorized or Forbid.</returns>
        [Authorize]
        [HttpGet("{id}/orders")]
        public async Task<IActionResult> GetUserOrders(int id)
        {
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
                return Unauthorized("User does not have authorization for this method");

            if (authenticatedUserId != id)
                return Forbid("User is forbidden from accessing this method");

            var orders = await _context.Orders
                .Where(o => o.UserId == id)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    orderId = o.Id,
                    puzzleId = o.PuzzleId,
                    fullName = o.FullName,
                    amount = o.Amount,
                    status = o.Status.ToString(),
                    createdAt = o.CreatedAt
                })
                .ToListAsync();
            return Ok(orders);
        }

        private int? GetAuthenticatedUserId()
        {
            var userIdValue = User.FindFirstValue("userId");

            if (int.TryParse(userIdValue, out var userId))
                return userId;

            return null;
        }
    }
}
