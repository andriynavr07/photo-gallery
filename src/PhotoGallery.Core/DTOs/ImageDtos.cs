namespace PhotoGallery.Core.DTOs;

public record ImageDto(int Id, string Url, int Likes, int Dislikes, bool? CurrentUserLike, int AlbumOwnerId, DateTime UploadedAt);
