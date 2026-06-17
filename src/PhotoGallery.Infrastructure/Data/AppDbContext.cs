using Microsoft.EntityFrameworkCore;
using PhotoGallery.Core.Entities;

namespace PhotoGallery.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Album> Albums => Set<Album>();
    public DbSet<Image> Images => Set<Image>();
    public DbSet<Like> Likes => Set<Like>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.Role).HasDefaultValue("User");
        });

        modelBuilder.Entity<Album>(e =>
        {
            e.HasOne(a => a.Owner)
             .WithMany(u => u.Albums)
             .HasForeignKey(a => a.OwnerId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Image>(e =>
        {
            e.HasOne(i => i.Album)
             .WithMany(a => a.Images)
             .HasForeignKey(i => i.AlbumId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Like>(e =>
        {
            e.HasIndex(l => new { l.UserId, l.ImageId }).IsUnique();
            e.HasOne(l => l.User).WithMany(u => u.Likes).HasForeignKey(l => l.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(l => l.Image).WithMany(i => i.Likes).HasForeignKey(l => l.ImageId).OnDelete(DeleteBehavior.Cascade);
        });

        // Seed: admin / Admin123!
        // Hash pre-computed to keep migrations deterministic
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            Username = "admin",
            PasswordHash = "$2a$11$Tl3UMf7pGfDOc5bHvJtNH.oQxHnmEkLbF4wSPzNqY3RiKdX2MgvWa",
            Role = "Admin"
        });
    }
}
