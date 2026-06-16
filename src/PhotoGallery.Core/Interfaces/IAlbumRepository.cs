using PhotoGallery.Core.DTOs;
using PhotoGallery.Core.Entities;

namespace PhotoGallery.Core.Interfaces;

public interface IAlbumRepository
{
    Task<(IEnumerable<Album> Items, int Total)> GetPagedAsync(int page, int pageSize);
    Task<Album?> GetByIdAsync(int id);
    Task<IEnumerable<Album>> GetByOwnerAsync(int userId);
    Task AddAsync(Album album);
    Task DeleteAsync(Album album);
    Task SaveChangesAsync();
}
