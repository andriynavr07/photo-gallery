using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PhotoGallery.Core.DTOs;
using PhotoGallery.Core.Entities;
using PhotoGallery.Core.Exceptions;
using PhotoGallery.Core.Interfaces;

namespace PhotoGallery.Infrastructure.Services;

public class ImageService(
    IImageRepository imageRepo,
    ILikeRepository likeRepo,
    IAlbumRepository albumRepo,
    IConfiguration config) : IImageService
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    public async Task<PagedResult<ImageDto>> GetByAlbumAsync(int albumId, int page, int pageSize, int? userId)
    {
        var (items, total) = await imageRepo.GetByAlbumPagedAsync(albumId, page, pageSize);
        var dtos = items.Select(i => MapToDto(i, userId));
        return new PagedResult<ImageDto>(dtos, total, page, pageSize);
    }

    public async Task<ImageDto> UploadAsync(int albumId, IFormFile file, int userId)
    {
        var album = await albumRepo.GetByIdAsync(albumId)
            ?? throw new NotFoundException($"Album {albumId} not found");

        if (album.OwnerId != userId)
            throw new ForbiddenException("You can only upload to your own albums");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            throw new ArgumentException("Invalid file type");

        var uploadsPath = config["Uploads:Path"] ?? "uploads";
        Directory.CreateDirectory(uploadsPath);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsPath, fileName);

        await using var stream = File.Create(filePath);
        await file.CopyToAsync(stream);

        var image = new Image
        {
            FileName = fileName,
            Url = $"/uploads/{fileName}",
            AlbumId = albumId
        };

        await imageRepo.AddAsync(image);
        await imageRepo.SaveChangesAsync();

        return MapToDto(image, userId);
    }

    public async Task DeleteAsync(int imageId, int requesterId, bool isAdmin)
    {
        var image = await imageRepo.GetByIdAsync(imageId)
            ?? throw new NotFoundException($"Image {imageId} not found");

        if (!isAdmin && image.Album.OwnerId != requesterId)
            throw new ForbiddenException();

        // Delete physical file
        var uploadsPath = config["Uploads:Path"] ?? "uploads";
        var filePath = Path.Combine(uploadsPath, image.FileName);
        if (File.Exists(filePath)) File.Delete(filePath);

        await imageRepo.DeleteAsync(image);
        await imageRepo.SaveChangesAsync();
    }

    public async Task<ImageDto> ToggleLikeAsync(int imageId, int userId, bool isLike)
    {
        var image = await imageRepo.GetByIdAsync(imageId)
            ?? throw new NotFoundException($"Image {imageId} not found");

        var existing = await likeRepo.GetAsync(userId, imageId);

        if (existing is not null)
        {
            if (existing.IsLike == isLike)
            {
                // Same reaction — remove it (toggle off)
                await likeRepo.DeleteAsync(existing);
            }
            else
            {
                // Switch reaction
                existing.IsLike = isLike;
            }
        }
        else
        {
            await likeRepo.AddAsync(new Like { UserId = userId, ImageId = imageId, IsLike = isLike });
        }

        await likeRepo.SaveChangesAsync();

        // Reload likes
        var updatedImage = await imageRepo.GetByIdAsync(imageId);
        return MapToDto(updatedImage!, userId);
    }

    private static ImageDto MapToDto(Image i, int? userId)
    {
        var likes = i.Likes.Count(l => l.IsLike);
        var dislikes = i.Likes.Count(l => !l.IsLike);
        bool? currentUserLike = userId.HasValue
            ? i.Likes.FirstOrDefault(l => l.UserId == userId)?.IsLike
            : null;
        return new ImageDto(i.Id, i.Url, likes, dislikes, currentUserLike, i.UploadedAt);
    }
}
