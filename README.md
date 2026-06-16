# Photo Gallery

ASP.NET Core Web API + React photo gallery application.

## Tech Stack

- **Backend**: ASP.NET Core 8, Entity Framework Core (Code-First), JWT Auth
- **Frontend**: React (Vite), Axios, React Router
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Tests**: xUnit, Moq

## Project Structure

```
src/
  PhotoGallery.API/           # Web API, Controllers, Middleware
  PhotoGallery.Core/          # Entities, Interfaces, DTOs
  PhotoGallery.Infrastructure/# EF Core, Repositories, Services
  PhotoGallery.Tests/         # Unit tests
client/                       # React SPA
```

## Getting Started

### Backend
```bash
cd src/PhotoGallery.API
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Features

- JWT authentication with Admin / User roles
- Album management with pagination (5 per page)
- Image upload with thumbnail support
- Like / Dislike system
- Role-based access control
