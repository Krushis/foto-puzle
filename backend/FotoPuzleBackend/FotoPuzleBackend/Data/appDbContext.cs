using Microsoft.EntityFrameworkCore;
using FotoPuzleBackend.Models.Entities;

namespace FotoPuzleBackend.Data
{
    /// <summary>
    /// Represents the application's database context for managing entity objects and database operations.
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Photo> Photos => Set<Photo>();
        public DbSet<Puzzle> Puzzles => Set<Puzzle>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Store enums as strings so the DB is readable
            modelBuilder.Entity<Photo>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Puzzle>()
                .Property(p => p.Difficulty)
                .HasConversion<string>();

            modelBuilder.Entity<Puzzle>()
                .Property(p => p.Status)
                .HasConversion<string>();

            // One photo can't have two puzzles of the same difficulty
            modelBuilder.Entity<Puzzle>()
                .HasIndex(p => new { p.PhotoId, p.Difficulty })
                .IsUnique();

            // Indexes
            modelBuilder.Entity<Photo>()
                .HasIndex(p => p.UserId);

            modelBuilder.Entity<Puzzle>()
                .HasIndex(p => p.UserId);
        }
    }
}
