using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Text;

using DotNetEnv;
using AuthService.Persistence.Data;
using AuthService.Application.Interfaces;
using AuthService.Application.Services;
using AuthService.Domain.Interfaces;
using AuthService.Api.Infrastructure.RestaurantApi;

var builder = WebApplication.CreateBuilder(args);

Env.Load();
// =========================
// Servicios base
// =========================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================
// Base de datos
// =========================
var connectionString =
    $"Host={Environment.GetEnvironmentVariable("DB_HOST")};" +
    $"Port={Environment.GetEnvironmentVariable("DB_PORT")};" +
    $"Database={Environment.GetEnvironmentVariable("DB_NAME")};" +
    $"Username={Environment.GetEnvironmentVariable("DB_USER")};" +
    $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD")}";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// =========================
// JWT Authentication
// =========================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
options.TokenValidationParameters = new TokenValidationParameters
{
ValidateIssuer = true,
ValidateAudience = true,
ValidateLifetime = true,
ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                builder.Configuration["JwtSettings:SecretKey"]!
            ))
    };
});

builder.Services.AddAuthorization();

// =========================
// Application Services
// =========================
builder.Services.AddScoped<IAuthService, AuthService.Application.Services.AuthService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IPasswordHashService, PasswordHashService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();

builder.Services.Configure<RestaurantApiOptions>(
builder.Configuration.GetSection(RestaurantApiOptions.SectionName));

builder.Services.AddHttpClient<IClienteProvisioningClient, ClienteProvisioningClient>(
(serviceProvider, client) =>
{
var options = serviceProvider
.GetRequiredService<IOptions<RestaurantApiOptions>>()
.Value;

    if (!Uri.TryCreate(options.BaseUrl, UriKind.Absolute, out var baseUri))
    {
        throw new InvalidOperationException(
            "RestaurantApi:BaseUrl must be a valid absolute URL.");
    }

    client.BaseAddress = baseUri;
    client.Timeout = TimeSpan.FromSeconds(
        Math.Max(1, options.TimeoutSeconds));
});

// =========================
// Repositories
// =========================
builder.Services.AddScoped<IUserRepository,
AuthService.Persistence.Repositories.UserRepository>();

builder.Services.AddScoped<IRefreshTokenRepository,
AuthService.Persistence.Repositories.RefreshTokenRepository>();

builder.Services.AddScoped<IRoleRepository,
AuthService.Persistence.Repositories.RoleRepository>();

// =========================
// CORS
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
// Swagger
// =========================
if (app.Environment.IsDevelopment())
{
app.UseSwagger();
app.UseSwaggerUI();
}

// =========================
// Pipeline
// =========================
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "API funcionando");

// =========================
// Migraciones y Seed
// =========================
using (var scope = app.Services.CreateScope())
{
var db = scope.ServiceProvider
.GetRequiredService<ApplicationDbContext>();


await db.Database.MigrateAsync();
await DataSeeder.SeedAsync(db);


}

app.Run();
