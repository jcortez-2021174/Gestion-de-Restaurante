using Microsoft.EntityFrameworkCore;
using AuthService.Persistence.Data;
using AuthService.Application.Interfaces;
using AuthService.Application.Services;
using AuthService.Domain.Interfaces;
using AuthService.Api.Infrastructure.RestaurantApi;
using Microsoft.Extensions.Options;

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
// ✅ APPLICATION SERVICES
// =========================
builder.Services.AddScoped<IAuthService, AuthService.Application.Services.AuthService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IPasswordHashService, PasswordHashService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
builder.Services.AddScoped<IEmailService, EmailService>();
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
        client.Timeout = TimeSpan.FromSeconds(Math.Max(1, options.TimeoutSeconds));
    });

//  ESTE ERA EL QUE TE FALTABA (ERROR PRINCIPAL)
builder.Services.AddScoped<IUserManagementService, UserManagementService>();

// =========================
// REPOSITORIES
// =========================
builder.Services.AddScoped<IUserRepository, AuthService.Persistence.Repositories.UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, AuthService.Persistence.Repositories.RefreshTokenRepository>();
builder.Services.AddScoped<IRoleRepository, AuthService.Persistence.Repositories.RoleRepository>();

// =========================
//  CORS
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
// 🔥 Middleware pipeline
// =========================
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Health check básico
app.MapGet("/", () => "API funcionando");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
    await DataSeeder.SeedAsync(db);
}


app.Run();
