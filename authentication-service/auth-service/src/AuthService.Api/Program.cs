using Microsoft.EntityFrameworkCore;
using AuthService.Persistence.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔥 Servicios
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// 🔥 Swagger (IMPORTANTE para probar login)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔥 Middlewares básicos
app.UseHttpsRedirection();

app.UseAuthorization();

// 🔥 Controllers
app.MapControllers();

// Test rápido
app.MapGet("/", () => "API funcionando");

app.Run();