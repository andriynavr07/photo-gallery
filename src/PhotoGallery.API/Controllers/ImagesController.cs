using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoGallery.Core.Interfaces;

namespace PhotoGallery.API.Controllers;

[ApiController]
[Route("api")]
public class ImagesController(IImageService imageService) : ControllerBase
{
    [HttpGet("albums/{albumId:int}/images")]
    public async Task<IActionResult> GetByAlbum(int albumId, [FromQuery] int page = 1, [FromQuery] int pageSize = 5)
    {
        var result = await imageService.GetByAlbumAsync(albumId, page, pageSize, TryGetUserId());
        return Ok(result);
    }

    [HttpPost("albums/{albumId:int}/images")]
    [Authorize]
    public async Task<IActionResult> Upload(int albumId, IFormFile file)
    {
        var result = await imageService.UploadAsync(albumId, file, GetUserId());
        return CreatedAtAction(nameof(GetByAlbum), new { albumId }, result);
    }

    [HttpDelete("images/{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await imageService.DeleteAsync(id, GetUserId(), IsAdmin());
        return NoContent();
    }

    [HttpPost("images/{id:int}/like")]
    [Authorize]
    public async Task<IActionResult> ToggleLike(int id, [FromBody] LikeRequest request)
    {
        var result = await imageService.ToggleLikeAsync(id, GetUserId(), request.IsLike);
        return Ok(result);
    }

    private int GetUserId() => int.Parse(User.FindFirstValue("userId")!);
    private int? TryGetUserId()
    {
        var val = User.FindFirstValue("userId");
        return val is null ? null : int.Parse(val);
    }
    private bool IsAdmin() => User.FindFirstValue("role") == "Admin";
}

public record LikeRequest(bool IsLike);
