using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PhotoGallery.Core.Interfaces;
using PhotoGallery.Infrastructure.Data;
using PhotoGallery.Infrastructure.Repositories;
using PhotoGallery.Infrastructure.Services;

namespace PhotoGallery.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(opt =>
            opt.UseSqlite(config.GetConnectionString("Default")));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAlbumRepository, AlbumRepository>();
        services.AddScoped<IImageRepository, ImageRepository>();
        services.AddScoped<ILikeRepository, LikeRepository>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAlbumService, AlbumService>();
        services.AddScoped<IImageService, ImageService>();

        return services;
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = config["Jwt:Issuer"],
                    ValidAudience = config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(config["Jwt:Key"]!))
                };
            });

        return services;
    }
}
