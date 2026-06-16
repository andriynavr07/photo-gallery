namespace PhotoGallery.Core.Entities;

public class Album
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public ICollection<Image> Images { get; set; } = new List<Image>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
