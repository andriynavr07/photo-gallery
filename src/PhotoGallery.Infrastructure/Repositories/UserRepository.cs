using Microsoft.EntityFrameworkCore;
using PhotoGallery.Core.Entities;
using PhotoGallery.Core.Interfaces;
using PhotoGallery.Infrastructure.Data;

namespace PhotoGallery.Infrastructure.Repositories;

public class UserRepository(AppDbContext db) : IUserRepository
{
    public async Task<User?> GetByUsernameAsync(string username) =>
        await db.Users.FirstOrDefaultAsync(u => u.Username == username);

    public async Task<User?> GetByIdAsync(int id) =>
        await db.Users.FindAsync(id);

    public async Task AddAsync(User user) => await db.Users.AddAsync(user);

    public async Task SaveChangesAsync() => await db.SaveChangesAsync();
}
