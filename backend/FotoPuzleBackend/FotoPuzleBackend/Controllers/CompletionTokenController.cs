using FotoPuzleBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FotoPuzleBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompletionTokenController : ControllerBase
    {
        private readonly CompletionTokenService _tokenService;
        private readonly ILogger<CompletionTokenController> _logger;

        public CompletionTokenController(CompletionTokenService tokenService, ILogger<CompletionTokenController> logger)
        {
            _tokenService = tokenService;
            _logger = logger;
        }

        // POST /api/completiontoken/issue
        [Authorize]
        [HttpPost("issue")]
        public async Task<IActionResult> Issue([FromBody] IssueTokenRequest request)
        {
            _logger.LogInformation("Token issue request for user {UserId}, puzzle {PuzzleId}", request.UserId, request.PuzzleId);
            try
            {
                var token = await _tokenService.IssueTokenAsync(request.UserId, request.PuzzleId);
                _logger.LogInformation("Token issued successfully for user {UserId}, puzzle {PuzzleId}", request.UserId, request.PuzzleId);
                return Ok(new { token.Token, token.EarnedAt });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Token issue failed for user {UserId}, puzzle {PuzzleId}: {Reason}", request.UserId, request.PuzzleId, ex.Message);
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET /api/completiontoken/my?userId=1
        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyTokens([FromQuery] int userId)
        {
            _logger.LogInformation("Fetching tokens for user {UserId}", userId);
            var tokens = await _tokenService.GetUserTokensAsync(userId);
            _logger.LogInformation("Returning {Count} tokens for user {UserId}", tokens.Count(), userId);
            return Ok(tokens.Select(t => new { t.Token, t.EarnedAt, t.PuzzleId }));
        }

        // GET /api/completiontoken/validate?userId=1&token=<guid>
        [Authorize]
        [HttpGet("validate")]
        public async Task<IActionResult> Validate([FromQuery] int userId, [FromQuery] string token)
        {
            _logger.LogInformation("Validating token for user {UserId}", userId);
            var isValid = await _tokenService.ValidateTokenAsync(userId, token);
            _logger.LogInformation("Token validation result for user {UserId}: {IsValid}", userId, isValid);
            return Ok(new { valid = isValid });
        }
    }

    // TODO Sprint 3 or 4: remove UserId from here once JWT is wired up,
    // and read it from claims via User.FindFirst(ClaimTypes.NameIdentifier) instead
    public record IssueTokenRequest(int UserId, int PuzzleId);
}
