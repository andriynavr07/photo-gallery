using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoGallery.Core.Interfaces;

namespace PhotoGallery.API.Controllers;

[ApiController]
[Route("api")]
public class ImagesController(IImageService imageService) : ControllerBase
{
    [HttpGet("albums/{albumId}/images")]
    public async Task<IActionResult> GetByAlbum(int albumId, [FromQuery] int page = 1, [FromQuery] int pageSize = 5)
    {
        var userId = TryGetUserId();
        var result = await imageService.GetByAlbumAsync(albumId, page, pageSize, userId);
        return Ok(result);
    }

    [HttpPost("albums/{albumId}/images")]
    [Authorize]
    public async Task<IActionResult> Upload(int albumId, IFormFile file)
    {
        var userId = GetUserId();
        var result = await imageService.UploadAsync(albumId, file, userId);
        return CreatedAtAction(nameof(GetByAlbum), new { albumId }, result);
    }

    [HttpDelete("images/{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var isAdmin = User.IsInRole("Admin");
        await imageService.DeleteAsync(id, userId, isAdmin);
        return NoContent();
    }

    [HttpPost("images/{id}/like")]
    [Authorize]
    public async Task<IActionResult> ToggleLike(int id, [FromBody] LikeRequest request)
    {
        var userId = GetUserId();
        var result = await imageService.ToggleLikeAsync(id, userId, request.IsLike);
        return Ok(result);
    }

    private int GetUserId() => int.Parse(User.FindFirstValue("userId")!);
    private int? TryGetUserId()
    {
        var claim = User.FindFirstValue("userId");
        return claim is null ? null : int.Parse(claim);
    }
}

public record LikeRequest(bool IsLike);
