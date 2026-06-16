namespace PhotoGallery.Core.Entities;

public class Like
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int ImageId { get; set; }
    public Image Image { get; set; } = null!;
    public bool IsLike { get; set; } // true = like, false = dislike
}
