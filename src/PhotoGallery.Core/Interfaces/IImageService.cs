using Microsoft.AspNetCore.Http;
using PhotoGallery.Core.DTOs;

namespace PhotoGallery.Core.Interfaces;

public interface IImageService
{
    Task<PagedResult<ImageDto>> GetByAlbumAsync(int albumId, int page, int pageSize, int? userId);
    Task<ImageDto> UploadAsync(int albumId, IFormFile file, int userId);
    Task DeleteAsync(int imageId, int requesterId, bool isAdmin);
    Task<ImageDto> ToggleLikeAsync(int imageId, int userId, bool isLike);
}
