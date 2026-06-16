using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoGallery.Core.DTOs;
using PhotoGallery.Core.Interfaces;

namespace PhotoGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagesController(IImageService imageService) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await imageService.DeleteAsync(id, UserId, IsAdmin);
        return NoContent();
    }

    [HttpPost("{id}/like")]
    [Authorize]
    public async Task<ActionResult<ImageDto>> Like(int id, [FromBody] LikeRequest request)
    {
        var result = await imageService.ToggleLikeAsync(id, UserId, request.IsLike);
        return Ok(result);
    }
}

public record LikeRequest(bool IsLike);
