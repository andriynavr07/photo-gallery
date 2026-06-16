using Moq;
using FluentAssertions;
using PhotoGallery.Core.DTOs;
using PhotoGallery.Core.Entities;
using PhotoGallery.Core.Exceptions;
using PhotoGallery.Core.Interfaces;
using PhotoGallery.Infrastructure.Services;

namespace PhotoGallery.Tests;

public class AlbumServiceTests
{
    private readonly Mock<IAlbumRepository> _repoMock = new();
    private readonly AlbumService _sut;

    public AlbumServiceTests() => _sut = new AlbumService(_repoMock.Object);

    [Fact]
    public async Task DeleteAsync_WhenNotOwnerAndNotAdmin_ThrowsForbidden()
    {
        _repoMock.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Album { Id = 1, OwnerId = 99, Owner = new User { Username = "other" } });

        await _sut.Invoking(s => s.DeleteAsync(1, requesterId: 5, isAdmin: false))
                  .Should().ThrowAsync<ForbiddenException>();
    }

    [Fact]
    public async Task DeleteAsync_WhenAdmin_DeletesSuccessfully()
    {
        var album = new Album { Id = 1, OwnerId = 99, Owner = new User { Username = "other" } };
        _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(album);
        _repoMock.Setup(r => r.DeleteAsync(album)).Returns(Task.CompletedTask);
        _repoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        await _sut.Invoking(s => s.DeleteAsync(1, requesterId: 1, isAdmin: true))
                  .Should().NotThrowAsync();
    }

    [Fact]
    public async Task DeleteAsync_WhenOwner_DeletesSuccessfully()
    {
        var album = new Album { Id = 1, OwnerId = 5, Owner = new User { Username = "owner" } };
        _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(album);
        _repoMock.Setup(r => r.DeleteAsync(album)).Returns(Task.CompletedTask);
        _repoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        await _sut.Invoking(s => s.DeleteAsync(1, requesterId: 5, isAdmin: false))
                  .Should().NotThrowAsync();
    }

    [Fact]
    public async Task DeleteAsync_WhenNotFound_ThrowsNotFoundException()
    {
        _repoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Album?)null);

        await _sut.Invoking(s => s.DeleteAsync(999, requesterId: 1, isAdmin: true))
                  .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task CreateAsync_ReturnsCreatedAlbum()
    {
        var request = new CreateAlbumRequest("My Album", "Desc");
        _repoMock.Setup(r => r.AddAsync(It.IsAny<Album>())).Returns(Task.CompletedTask);
        _repoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _sut.CreateAsync(request, userId: 1);

        result.Title.Should().Be("My Album");
        result.Description.Should().Be("Desc");
    }

    [Fact]
    public async Task GetAllAsync_ReturnsPaged()
    {
        var albums = new List<Album>
        {
            new() { Id = 1, Title = "A1", Owner = new User { Username = "u1" }, Images = [] },
            new() { Id = 2, Title = "A2", Owner = new User { Username = "u2" }, Images = [] }
        };
        _repoMock.Setup(r => r.GetPagedAsync(1, 5)).ReturnsAsync((albums, 2));

        var result = await _sut.GetAllAsync(1, 5);

        result.Total.Should().Be(2);
        result.Items.Should().HaveCount(2);
    }
}
