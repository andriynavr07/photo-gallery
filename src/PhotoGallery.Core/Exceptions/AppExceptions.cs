namespace PhotoGallery.Core.Exceptions;

public class NotFoundException(string message) : Exception(message);

public class ForbiddenException(string message = "Access denied") : Exception(message);
