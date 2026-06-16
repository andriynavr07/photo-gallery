using Moq;
using FluentAssertions;
using PhotoGallery.Core.Entities;
using PhotoGallery.Core.Exceptions;
using PhotoGallery.Core.Interfaces;
using PhotoGallery.Core.DTOs;
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

        await _sut.Invoking(s => s.DeleteAsync(1, requesterId: 5, isAdmin: true))
            .Should().NotThrowAsync();

        _repoMock.Verify(r => r.DeleteAsync(album), Times.Once);
        _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WhenOwner_DeletesSuccessfully()
    {
        var album = new Album { Id = 1, OwnerId = 5, Owner = new User { Username = "me" } };
        _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(album);

        await _sut.Invoking(s => s.DeleteAsync(1, requesterId: 5, isAdmin: false))
            .Should().NotThrowAsync();

        _repoMock.Verify(r => r.DeleteAsync(album), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WhenNotFound_ThrowsNotFoundException()
    {
        _repoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Album?)null);

        await _sut.Invoking(s => s.DeleteAsync(99, 1, false))
            .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task GetAllAsync_ReturnsMappedPagedResult()
    {
        var albums = Enumerable.Range(1, 3).Select(i => new Album
        {
            Id = i, Title = $"Album {i}", OwnerId = 1,
            Owner = new User { Username = "user1" },
            Images = new List<Core.Entities.Image>()
        }).ToList();

        _repoMock.Setup(r => r.GetPagedAsync(1, 5)).ReturnsAsync((albums, 3));

        var result = await _sut.GetAllAsync(1, 5);

        result.Total.Should().Be(3);
        result.Items.Should().HaveCount(3);
        result.Page.Should().Be(1);
    }

    [Fact]
    public async Task CreateAsync_ReturnsNewAlbumDto()
    {
        _repoMock.Setup(r => r.AddAsync(It.IsAny<Album>())).Returns(Task.CompletedTask);
        _repoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _sut.CreateAsync(new CreateAlbumRequest("My Album", "Desc"), userId: 1);

        result.Title.Should().Be("My Album");
        result.Description.Should().Be("Desc");
    }
}
