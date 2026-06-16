using Microsoft.EntityFrameworkCore;
using PhotoGallery.Core.Entities;
using PhotoGallery.Core.Interfaces;
using PhotoGallery.Infrastructure.Data;

namespace PhotoGallery.Infrastructure.Repositories;

public class AlbumRepository(AppDbContext db) : IAlbumRepository
{
    public async Task<(IEnumerable<Album> Items, int Total)> GetPagedAsync(int page, int pageSize)
    {
        var query = db.Albums.Include(a => a.Owner).Include(a => a.Images);
        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, total);
    }

    public async Task<Album?> GetByIdAsync(int id) =>
        await db.Albums.Include(a => a.Owner).Include(a => a.Images).FirstOrDefaultAsync(a => a.Id == id);

    public async Task<IEnumerable<Album>> GetByOwnerAsync(int userId) =>
        await db.Albums.Include(a => a.Images)
            .Where(a => a.OwnerId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

    public async Task AddAsync(Album album) => await db.Albums.AddAsync(album);

    public Task DeleteAsync(Album album)
    {
        db.Albums.Remove(album);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() => await db.SaveChangesAsync();
}
