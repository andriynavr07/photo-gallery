using PhotoGallery.Core.DTOs;

namespace PhotoGallery.Core.Interfaces;

public interface IAlbumService
{
    Task<PagedResult<AlbumDto>> GetAllAsync(int page, int pageSize);
    Task<IEnumerable<AlbumDto>> GetMyAlbumsAsync(int userId);
    Task<AlbumDto> CreateAsync(CreateAlbumRequest request, int userId);
    Task DeleteAsync(int albumId, int requesterId, bool isAdmin);
}
