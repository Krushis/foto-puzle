using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FotoPuzleBackend.Services
{
    public class CompletionTokenService
    {
        private readonly AppDbContext _db;

        public CompletionTokenService(AppDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Issues a new token for a completed puzzle.
        /// If one already exists for this puzzle (e.g. user re-submits), returns the existing one.
        /// </summary>
        public async Task<CompletionToken> IssueTokenAsync(int userId, int puzzleId)
        {
            // Idempotent: return existing token if puzzle was already completed
            var existing = await _db.CompletionTokens
                .FirstOrDefaultAsync(ct => ct.PuzzleId == puzzleId && ct.UserId == userId);

            if (existing is not null)
                return existing;

            // Verify the puzzle belongs to this user and is in Ready state
            var puzzle = await _db.Puzzles
                .FirstOrDefaultAsync(p => p.Id == puzzleId && p.UserId == userId);

            if (puzzle is null)
                throw new InvalidOperationException("Puzzle not found or does not belong to user.");

            var token = new CompletionToken
            {
                UserId = userId,
                PuzzleId = puzzleId,
                Token = Guid.NewGuid().ToString()
            };

            _db.CompletionTokens.Add(token);
            await _db.SaveChangesAsync();
            return token;
        }

        /// <summary>
        /// Returns all tokens earned by a user (for discount redemption checks).
        /// </summary>
        public async Task<List<CompletionToken>> GetUserTokensAsync(int userId)
        {
            return await _db.CompletionTokens
                .Where(ct => ct.UserId == userId)
                .OrderByDescending(ct => ct.EarnedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Validates a token string — returns true if it exists and belongs to the user.
        /// </summary>
        public async Task<bool> ValidateTokenAsync(int userId, string token)
        {
            return await _db.CompletionTokens
                .AnyAsync(ct => ct.UserId == userId && ct.Token == token);
        }
    }
}
