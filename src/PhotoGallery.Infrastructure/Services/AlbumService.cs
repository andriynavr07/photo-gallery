using PhotoGallery.Core.DTOs;
using PhotoGallery.Core.Entities;
using PhotoGallery.Core.Exceptions;
using PhotoGallery.Core.Interfaces;

namespace PhotoGallery.Infrastructure.Services;

public class AlbumService(IAlbumRepository albumRepo) : IAlbumService
{
    public async Task<PagedResult<AlbumDto>> GetAllAsync(int page, int pageSize)
    {
        var (items, total) = await albumRepo.GetPagedAsync(page, pageSize);
        var dtos = items.Select(MapToDto);
        return new PagedResult<AlbumDto>(dtos, total, page, pageSize);
    }

    public async Task<IEnumerable<AlbumDto>> GetMyAlbumsAsync(int userId)
    {
        var albums = await albumRepo.GetByOwnerAsync(userId);
        return albums.Select(MapToDto);
    }

    public async Task<AlbumDto> CreateAsync(CreateAlbumRequest request, int userId)
    {
        var album = new Album
        {
            Title = request.Title,
            Description = request.Description,
            OwnerId = userId
        };
        await albumRepo.AddAsync(album);
        await albumRepo.SaveChangesAsync();
        return MapToDto(album);
    }

    public async Task DeleteAsync(int albumId, int requesterId, bool isAdmin)
    {
        var album = await albumRepo.GetByIdAsync(albumId)
            ?? throw new NotFoundException($"Album {albumId} not found");

        if (!isAdmin && album.OwnerId != requesterId)
            throw new ForbiddenException();

        await albumRepo.DeleteAsync(album);
        await albumRepo.SaveChangesAsync();
    }

    private static AlbumDto MapToDto(Album a)
    {
        var cover = a.Images.OrderBy(i => i.UploadedAt).FirstOrDefault();
        return new AlbumDto(a.Id, a.Title, a.Description, a.OwnerId, a.Owner?.Username ?? "", cover?.Url, a.Images.Count, a.CreatedAt);
    }
}
