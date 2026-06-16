using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoGallery.Core.DTOs;
using PhotoGallery.Core.Interfaces;

namespace PhotoGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlbumsController(IAlbumService albumService, IImageService imageService) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpGet]
    public async Task<ActionResult<PagedResult<AlbumDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        => Ok(await albumService.GetAllAsync(page, pageSize));

    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<AlbumDto>>> GetMy()
        => Ok(await albumService.GetMyAlbumsAsync(UserId));

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<AlbumDto>> Create(CreateAlbumRequest request)
    {
        var album = await albumService.CreateAsync(request, UserId);
        return CreatedAtAction(nameof(GetAll), new { id = album.Id }, album);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await albumService.DeleteAsync(id, UserId, IsAdmin);
        return NoContent();
    }

    [HttpGet("{id}/images")]
    public async Task<ActionResult<PagedResult<ImageDto>>> GetImages(
        int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 5)
    {
        int? userId = User.Identity?.IsAuthenticated == true ? UserId : null;
        return Ok(await imageService.GetByAlbumAsync(id, page, pageSize, userId));
    }

    [HttpPost("{id}/images")]
    [Authorize]
    public async Task<ActionResult<ImageDto>> UploadImage(int id, IFormFile file)
    {
        var image = await imageService.UploadAsync(id, file, UserId);
        return Ok(image);
    }
}
