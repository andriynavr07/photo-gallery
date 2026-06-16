using System.Net;
using System.Text.Json;
using PhotoGallery.Core.Exceptions;

namespace PhotoGallery.API.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var (status, message) = ex switch
        {
            NotFoundException e => (HttpStatusCode.NotFound, e.Message),
            ForbiddenException e => (HttpStatusCode.Forbidden, e.Message),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred")
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        return context.Response.WriteAsync(JsonSerializer.Serialize(new { error = message }));
    }
}
