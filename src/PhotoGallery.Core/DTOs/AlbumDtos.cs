namespace PhotoGallery.Core.DTOs;

public record AlbumDto(int Id, string Title, string? Description, int OwnerId, string OwnerName, string? CoverUrl, int ImageCount, DateTime CreatedAt);

public record CreateAlbumRequest(string Title, string? Description);

public record PagedResult<T>(IEnumerable<T> Items, int Total, int Page, int PageSize);
