using Microsoft.EntityFrameworkCore;
using FotoPuzleBackend.Models.Entities;

namespace FotoPuzleBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Photo> Photos => Set<Photo>();
        public DbSet<Puzzle> Puzzles => Set<Puzzle>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<CompletionToken> CompletionTokens => Set<CompletionToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Photo>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Puzzle>()
                .Property(p => p.Difficulty)
                .HasConversion<string>();

            modelBuilder.Entity<Puzzle>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Puzzle>()
                .HasIndex(p => new { p.PhotoId, p.Difficulty })
                .IsUnique();

            modelBuilder.Entity<Photo>()
                .HasIndex(p => p.UserId);

            modelBuilder.Entity<Puzzle>()
                .HasIndex(p => p.UserId);

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.UserId);

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.PuzzleId);

            modelBuilder.Entity<CompletionToken>()
                .HasIndex(ct => ct.PuzzleId)
                .IsUnique();

            modelBuilder.Entity<CompletionToken>()
                .HasIndex(ct => ct.Token)
                .IsUnique();

            modelBuilder.Entity<CompletionToken>()
                .HasIndex(ct => ct.UserId);
        }
    }
}