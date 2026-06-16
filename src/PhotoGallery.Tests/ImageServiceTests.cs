using Moq;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using PhotoGallery.Core.Entities;
using PhotoGallery.Core.Exceptions;
using PhotoGallery.Core.Interfaces;
using PhotoGallery.Infrastructure.Services;

namespace PhotoGallery.Tests;

public class ImageServiceTests
{
    private readonly Mock<IImageRepository> _imageRepoMock = new();
    private readonly Mock<ILikeRepository> _likeRepoMock = new();
    private readonly Mock<IAlbumRepository> _albumRepoMock = new();
    private readonly Mock<IConfiguration> _configMock = new();
    private readonly ImageService _sut;

    public ImageServiceTests()
    {
        _configMock.Setup(c => c["Uploads:Path"]).Returns("uploads");
        _sut = new ImageService(_imageRepoMock.Object, _likeRepoMock.Object, _albumRepoMock.Object, _configMock.Object);
    }

    [Fact]
    public async Task DeleteAsync_WhenNotOwnerAndNotAdmin_ThrowsForbidden()
    {
        var image = new Image { Id = 1, Album = new Album { OwnerId = 99 }, Likes = [] };
        _imageRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(image);

        await _sut.Invoking(s => s.DeleteAsync(1, requesterId: 5, isAdmin: false))
                  .Should().ThrowAsync<ForbiddenException>();
    }

    [Fact]
    public async Task ToggleLikeAsync_NewLike_AddsLike()
    {
        var image = new Image { Id = 1, Album = new Album { OwnerId = 1 }, Likes = [], FileName = "test.jpg", Url = "/uploads/test.jpg" };
        _imageRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(image);
        _likeRepoMock.Setup(r => r.GetAsync(5, 1)).ReturnsAsync((Like?)null);
        _likeRepoMock.Setup(r => r.AddAsync(It.IsAny<Like>())).Returns(Task.CompletedTask);
        _likeRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _sut.ToggleLikeAsync(1, userId: 5, isLike: true);

        _likeRepoMock.Verify(r => r.AddAsync(It.Is<Like>(l => l.IsLike && l.UserId == 5)), Times.Once);
    }

    [Fact]
    public async Task ToggleLikeAsync_SameReaction_RemovesLike()
    {
        var existingLike = new Like { Id = 1, UserId = 5, ImageId = 1, IsLike = true };
        var image = new Image { Id = 1, Album = new Album { OwnerId = 1 }, Likes = [existingLike], FileName = "test.jpg", Url = "/uploads/test.jpg" };
        _imageRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(image);
        _likeRepoMock.Setup(r => r.GetAsync(5, 1)).ReturnsAsync(existingLike);
        _likeRepoMock.Setup(r => r.DeleteAsync(existingLike)).Returns(Task.CompletedTask);
        _likeRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        await _sut.ToggleLikeAsync(1, userId: 5, isLike: true);

        _likeRepoMock.Verify(r => r.DeleteAsync(existingLike), Times.Once);
    }
}
