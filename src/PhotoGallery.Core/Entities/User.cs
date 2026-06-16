namespace PhotoGallery.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
    public ICollection<Album> Albums { get; set; } = new List<Album>();
    public ICollection<Like> Likes { get; set; } = new List<Like>();
}
