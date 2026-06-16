using PhotoGallery.Core.DTOs;

namespace PhotoGallery.Core.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
}
