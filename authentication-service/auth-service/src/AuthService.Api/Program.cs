using Microsoft.EntityFrameworkCore;
using AuthService.Persistence.Data;
using AuthService.Application.Interfaces;
using AuthService.Domain.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// =========================
// 🔥 Servicios base
// =========================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================
// ✅ DB
// =========================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// =========================
// ✅ SERVICES
// =========================
builder.Services.AddScoped<
    AuthService.Application.Interfaces.IAuthService,
    AuthService.Application.Services.AuthService>();

builder.Services.AddScoped<
    AuthService.Application.Interfaces.IRefreshTokenService,
    AuthService.Application.Services.RefreshTokenService>();

builder.Services.AddScoped<
    AuthService.Application.Interfaces.IJwtTokenService,
    AuthService.Application.Services.JwtTokenService>();

builder.Services.AddScoped<
    AuthService.Application.Interfaces.IPasswordHashService,
    AuthService.Application.Services.PasswordHashService>();

builder.Services.AddScoped<
    AuthService.Application.Interfaces.ICloudinaryService,
    AuthService.Application.Services.CloudinaryService>();

builder.Services.AddScoped<
    AuthService.Application.Interfaces.IEmailService,
    AuthService.Application.Services.EmailService>();

// =========================
// ✅ REPOSITORIES
// =========================
builder.Services.AddScoped<
    AuthService.Domain.Interfaces.IUserRepository,
    AuthService.Persistence.Repositories.UserRepository>();

builder.Services.AddScoped<
    AuthService.Domain.Interfaces.IRefreshTokenRepository,
    AuthService.Persistence.Repositories.RefreshTokenRepository>();

builder.Services.AddScoped<
    AuthService.Domain.Interfaces.IRoleRepository,
    AuthService.Persistence.Repositories.RoleRepository>();

// =========================
// ✅ CORS
// =========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// =========================
// 🔥 Swagger
// =========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// =========================
// 🔥 Middlewares
// =========================
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();

// =========================
// 🔥 Controllers
// =========================
app.MapControllers();

app.MapGet("/", () => "API funcionando");

app.Run();