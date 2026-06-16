using Microsoft.EntityFrameworkCore;
using PhotoGallery.Core.Entities;
using PhotoGallery.Core.Interfaces;
using PhotoGallery.Infrastructure.Data;

namespace PhotoGallery.Infrastructure.Repositories;

public class ImageRepository(AppDbContext db) : IImageRepository
{
    public async Task<(IEnumerable<Image> Items, int Total)> GetByAlbumPagedAsync(int albumId, int page, int pageSize)
    {
        var query = db.Images.Include(i => i.Likes).Where(i => i.AlbumId == albumId);
        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(i => i.UploadedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, total);
    }

    public async Task<Image?> GetByIdAsync(int id) =>
        await db.Images.Include(i => i.Likes).Include(i => i.Album).FirstOrDefaultAsync(i => i.Id == id);

    public async Task AddAsync(Image image) => await db.Images.AddAsync(image);

    public Task DeleteAsync(Image image)
    {
        db.Images.Remove(image);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() => await db.SaveChangesAsync();
}
