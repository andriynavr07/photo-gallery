using PhotoGallery.Core.Entities;

namespace PhotoGallery.Core.Interfaces;

public interface ILikeRepository
{
    Task<Like?> GetAsync(int userId, int imageId);
    Task AddAsync(Like like);
    Task DeleteAsync(Like like);
    Task<(int Likes, int Dislikes)> GetCountsAsync(int imageId);
    Task SaveChangesAsync();
}
