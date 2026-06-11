using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Identity;
using AuthService.Application.Interfaces;
using AuthService.Application.Services;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using Microsoft.Extensions.Logging.Abstractions;
using AuthApplicationService = AuthService.Application.Services.AuthService;
using Xunit;

namespace AuthService.Identity.Tests;

public sealed class RegistrationProvisioningTests
{
    [Fact]
    public async Task RegisterAsync_KeepsSuccessfulRegistrationWhenProvisioningFails()
    {
        var userRepository = new FakeUserRepository();
        var provisioningClient = new CapturingProvisioningClient(
            ClienteProvisioningResult.Failure(null, 0, null, null),
            throwOnProvision: true);
        var service = CreateService(userRepository, provisioningClient);

        var result = await service.RegisterAsync(CreateRegisterDto());

        Assert.True(result.Success);
        Assert.NotNull(userRepository.CreatedUser);
        Assert.Equal(userRepository.CreatedUser!.Id, provisioningClient.LastRequest?.AuthUserId);
        Assert.Equal("Ana", provisioningClient.LastRequest?.Nombre);
        Assert.Equal("Lopez", provisioningClient.LastRequest?.Apellido);
        Assert.Equal("ana@example.com", provisioningClient.LastRequest?.Correo);
        Assert.Equal("55551234", provisioningClient.LastRequest?.Telefono);
    }

    [Fact]
    public async Task RegisterAsync_DoesNotProvisionDuplicateEmail()
    {
        var userRepository = new FakeUserRepository { EmailExists = true };
        var provisioningClient = new CapturingProvisioningClient(
            ClienteProvisioningResult.Failure(null, 0, null, null));
        var service = CreateService(userRepository, provisioningClient);

        await Assert.ThrowsAsync<AuthService.Application.Exceptions.BusinessException>(
            () => service.RegisterAsync(CreateRegisterDto()));

        Assert.Null(userRepository.CreatedUser);
        Assert.Null(provisioningClient.LastRequest);
    }

    private static AuthApplicationService CreateService(
        FakeUserRepository userRepository,
        CapturingProvisioningClient provisioningClient) =>
        new(
            new FakeRefreshTokenService(),
            userRepository,
            new FakeRoleRepository(),
            new FakePasswordHashService(),
            new FakeJwtTokenService(),
            new FakeCloudinaryService(),
            new FakeEmailService(),
            provisioningClient,
            NullLogger<AuthApplicationService>.Instance);

    private static RegisterDto CreateRegisterDto() => new()
    {
        Name = "Ana",
        Surname = "Lopez",
        Username = "ana.lopez",
        Email = "ana@example.com",
        Password = "Segura123",
        Phone = "55551234",
    };

    private sealed class CapturingProvisioningClient(
        ClienteProvisioningResult result,
        bool throwOnProvision = false)
        : IClienteProvisioningClient
    {
        public ClienteProvisioningRequestDto? LastRequest { get; private set; }

        public Task<ClienteProvisioningResult> ProvisionAsync(
            ClienteProvisioningRequestDto request,
            CancellationToken cancellationToken = default)
        {
            LastRequest = request;
            if (throwOnProvision)
            {
                throw new HttpRequestException("Restaurant API unavailable");
            }

            return Task.FromResult(result);
        }
    }

    private sealed class FakeUserRepository : IUserRepository
    {
        public bool EmailExists { get; init; }
        public User? CreatedUser { get; private set; }

        public Task<User> CreateAsync(User user)
        {
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            user.UserRoles.First().Role = new Role
            {
                Id = user.UserRoles.First().RoleId,
                Name = RoleConstants.USER_ROLE,
            };
            CreatedUser = user;
            return Task.FromResult(user);
        }

        public Task<bool> ExistsByEmailAsync(string email) => Task.FromResult(EmailExists);
        public Task<bool> ExistsByUsernameAsync(string username) => Task.FromResult(false);
        public Task<IEnumerable<User>> GetUsersAsync() => Task.FromResult<IEnumerable<User>>([]);
        public Task<User> GetByIdAsync(string id) => Task.FromResult(CreatedUser!);
        public Task<User?> GetByEmailAsync(string email) => Task.FromResult<User?>(null);
        public Task<User?> GetByUsernameAsync(string username) => Task.FromResult<User?>(null);
        public Task<User?> GetByEmailVerificationTokenAsync(string token) => Task.FromResult<User?>(null);
        public Task<User?> GetByPasswordResetTokenAsync(string token) => Task.FromResult<User?>(null);
        public Task<User> UpdateAsync(User user) => Task.FromResult(user);
        public Task<bool> DeleteAsync(string id) => Task.FromResult(true);
        public Task UpdateUserRoleAsync(string userId, string roleId) => Task.CompletedTask;
    }

    private sealed class FakeRoleRepository : IRoleRepository
    {
        public Task<Role?> GetByNameAsync(string roleName) => Task.FromResult<Role?>(new Role
        {
            Id = "role-user",
            Name = roleName,
        });

        public Task<int> CountUsersInRoleAsync(string roleName) => Task.FromResult(0);
        public Task<IReadOnlyList<User>> GetUsersByRoleAsync(string roleName) =>
            Task.FromResult<IReadOnlyList<User>>([]);
        public Task<IReadOnlyList<string>> GetUserRoleNamesAsync(string userId) =>
            Task.FromResult<IReadOnlyList<string>>([]);
    }

    private sealed class FakePasswordHashService : IPasswordHashService
    {
        public string HashPassword(string password) => $"hashed:{password}";
        public bool VerifyPassword(string password, string hashedPassword) => true;
    }

    private sealed class FakeCloudinaryService : ICloudinaryService
    {
        public Task<string> UploadImageAsync(IFileData imageFile, string fileName) =>
            Task.FromResult(fileName);
        public Task<bool> DeleteImageAsync(string publicId) => Task.FromResult(true);
        public string GetDefaultAvatarUrl() => "default-avatar";
        public string GetFullImageUrl(string imagePath) => imagePath;
    }

    private sealed class FakeEmailService : IEmailService
    {
        public Task SendEmailVerificationAsync(string email, string username, string token) =>
            Task.CompletedTask;
        public Task SendPasswordResetAsync(string email, string username, string token) =>
            Task.CompletedTask;
        public Task SendPasswordChangedAsync(string email, string username) =>
            Task.CompletedTask;
        public Task SendWelcomeEmailAsync(string email, string username) => Task.CompletedTask;
    }

    private sealed class FakeJwtTokenService : IJwtTokenService
    {
        public string GenerateToken(User user) => "token";
        public Task<string> GenerateTokenAsync(string userId, int expiresInMinutes = 15) =>
            Task.FromResult("token");
    }

    private sealed class FakeRefreshTokenService : IRefreshTokenService
    {
        public Task<(string rawToken, Guid familyId)> CreateAsync(
            string userId,
            Guid? familyId = null) =>
            Task.FromResult(("refresh", familyId ?? Guid.NewGuid()));

        public Task<RefreshResponseDto> RotateAsync(string rawToken) =>
            throw new NotSupportedException();
        public Task RevokeAsync(string rawToken) => Task.CompletedTask;
    }
}
