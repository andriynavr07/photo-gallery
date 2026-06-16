using Microsoft.EntityFrameworkCore;
using PhotoGallery.Core.Entities;
using PhotoGallery.Core.Interfaces;
using PhotoGallery.Infrastructure.Data;

namespace PhotoGallery.Infrastructure.Repositories;

public class LikeRepository(AppDbContext db) : ILikeRepository
{
    public async Task<Like?> GetAsync(int userId, int imageId) =>
        await db.Likes.FirstOrDefaultAsync(l => l.UserId == userId && l.ImageId == imageId);

    public async Task AddAsync(Like like) => await db.Likes.AddAsync(like);

    public Task DeleteAsync(Like like)
    {
        db.Likes.Remove(like);
        return Task.CompletedTask;
    }

    public async Task<(int Likes, int Dislikes)> GetCountsAsync(int imageId)
    {
        var likes = await db.Likes.Where(l => l.ImageId == imageId).ToListAsync();
        return (likes.Count(l => l.IsLike), likes.Count(l => !l.IsLike));
    }

    public async Task SaveChangesAsync() => await db.SaveChangesAsync();
}
