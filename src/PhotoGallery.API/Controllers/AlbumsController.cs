using System.Security.Claims;
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
        var userId = GetUserId();
        var result = await albumService.GetMyAlbumsAsync(userId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateAlbumRequest request)
    {
        var userId = GetUserId();
        var result = await albumService.CreateAsync(request, userId);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var isAdmin = User.IsInRole("Admin");
        await albumService.DeleteAsync(id, userId, isAdmin);
        return NoContent();
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue("userId")!);
}
