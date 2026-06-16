namespace PhotoGallery.Core.Entities;

public class Image
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int AlbumId { get; set; }
    public Album Album { get; set; } = null!;
    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
