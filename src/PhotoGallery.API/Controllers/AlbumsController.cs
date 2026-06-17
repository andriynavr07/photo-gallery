using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoGallery.Core.DTOs;
using PhotoGallery.Core.Interfaces;

namespace PhotoGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlbumsController(IAlbumService albumService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
    {
        var result = await albumService.GetAllAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMy()
    {
        var result = await albumService.GetMyAlbumsAsync(GetUserId());
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateAlbumRequest request)
    {
        var result = await albumService.CreateAsync(request, GetUserId());
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await albumService.DeleteAsync(id, GetUserId(), IsAdmin());
        return NoContent();
    }

    private int GetUserId() => int.Parse(User.FindFirstValue("userId")!);
    private bool IsAdmin() => User.FindFirstValue("role") == "Admin";
}
