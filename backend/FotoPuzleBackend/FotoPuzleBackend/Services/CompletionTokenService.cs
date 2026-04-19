using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FotoPuzleBackend.Services
{
    public class CompletionTokenService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config; // 👈 added

        public CompletionTokenService(AppDbContext db, IConfiguration config) // 👈 added config
        {
            _db = db;
            _config = config;
        }

        public async Task<CompletionToken> IssueTokenAsync(int userId, int puzzleId)
        {
            // Idempotent: return existing token if puzzle was already completed
            var existing = await _db.CompletionTokens
                .FirstOrDefaultAsync(ct => ct.PuzzleId == puzzleId && ct.UserId == userId);
            if (existing is not null)
                return existing;

            // Verify the puzzle belongs to this user
            var puzzle = await _db.Puzzles
                .FirstOrDefaultAsync(p => p.Id == puzzleId && p.UserId == userId);
            if (puzzle is null)
                throw new InvalidOperationException("Puzzle not found or does not belong to user.");

            // 👇 Generate JWT instead of GUID
            var claims = new[]
            {
                new Claim("userId", userId.ToString()),
                new Claim("puzzleId", puzzleId.ToString()),
                new Claim("discountPercent", "5"),
                new Claim("type", "discount")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(jwt);

            var token = new CompletionToken
            {
                UserId = userId,
                PuzzleId = puzzleId,
                Token = tokenString // 👈 JWT instead of Guid
            };

            _db.CompletionTokens.Add(token);
            await _db.SaveChangesAsync();
            return token;
        }

        public async Task<List<CompletionToken>> GetUserTokensAsync(int userId)
        {
            return await _db.CompletionTokens
                .Where(ct => ct.UserId == userId)
                .OrderByDescending(ct => ct.EarnedAt)
                .ToListAsync();
        }

        // 👇 ValidateTokenAsync now also verifies the JWT signature
        public async Task<bool> ValidateTokenAsync(int userId, string token)
        {
            var exists = await _db.CompletionTokens
                .AnyAsync(ct => ct.UserId == userId && ct.Token == token);

            if (!exists) return false;

            // Verify the JWT is valid and not expired
            try
            {
                var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

                var handler = new JwtSecurityTokenHandler();
                handler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _config["Jwt:Audience"],
                    ValidateLifetime = true
                }, out _);

                return true;
            }
            catch
            {
                return false; // expired or tampered
            }
        }
    }
}