using PhotoGallery.Core.Entities;

namespace PhotoGallery.Core.Interfaces;

public interface IImageRepository
{
    Task<(IEnumerable<Image> Items, int Total)> GetByAlbumPagedAsync(int albumId, int page, int pageSize);
    Task<Image?> GetByIdAsync(int id);
    Task AddAsync(Image image);
    Task DeleteAsync(Image image);
    Task SaveChangesAsync();
}
