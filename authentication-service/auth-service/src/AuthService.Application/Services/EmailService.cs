using System.Net;
using AuthService.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace AuthService.Application.Services;

public class EmailService(IConfiguration configuration, ILogger<EmailService> logger) : IEmailService
{
    public Task SendEmailVerificationAsync(string email, string username, string token)
    {
        var url = FrontendUrl($"/verify-email?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(email)}");
        return SendEmailAsync(email, "Aurea | Verifica tu correo", BuildTemplate(new EmailTemplate
        {
            Eyebrow = "Seguridad de cuenta",
            Title = "Confirma tu lugar en Aurea",
            Intro = $"Hola {Encode(username)}, verifica tu correo para activar tu cuenta y proteger tus futuras reservas, pedidos y recompensas.",
            ButtonText = "Verificar mi correo",
            ButtonUrl = url,
            CardTitle = "Enlace seguro",
            CardBody = "Este enlace expira en 24 horas y solo puede utilizarse una vez.",
            Icon = "&#10003;",
            Note = "Si no creaste esta cuenta, puedes ignorar este mensaje con tranquilidad.",
        }));
    }

    public Task SendPasswordResetAsync(string email, string username, string token)
    {
        var url = FrontendUrl($"/reset-password?token={Uri.EscapeDataString(token)}");
        return SendEmailAsync(email, "Aurea | Recupera tu contrasena", BuildTemplate(new EmailTemplate
        {
            Eyebrow = "Acceso seguro",
            Title = "Crea una nueva contrasena",
            Intro = $"Hola {Encode(username)}, recibimos una solicitud para recuperar el acceso a tu cuenta Aurea.",
            ButtonText = "Restablecer contrasena",
            ButtonUrl = url,
            CardTitle = "Disponible durante 1 hora",
            CardBody = "Por tu seguridad, el enlace expirara y quedara inutilizado despues del cambio.",
            Icon = "&#128274;",
            Note = "Nunca compartas este enlace. Aurea no solicitara tu contrasena por correo.",
        }));
    }

    public Task SendPasswordChangedAsync(string email, string username) =>
        SendEmailAsync(email, "Aurea | Tu contrasena fue actualizada", BuildTemplate(new EmailTemplate
        {
            Eyebrow = "Cambio importante de cuenta",
            Title = "Contrasena actualizada",
            Intro = $"Hola {Encode(username)}, confirmamos que la contrasena de tu cuenta Aurea fue cambiada correctamente.",
            ButtonText = "Iniciar sesion",
            ButtonUrl = FrontendUrl("/login"),
            CardTitle = "Tu cuenta esta protegida",
            CardBody = $"Cambio registrado el {DateTime.Now:dd/MM/yyyy} a las {DateTime.Now:HH:mm}.",
            Icon = "&#10003;",
            Note = "Si no reconoces este cambio, contacta inmediatamente al equipo Aurea.",
        }));

    public Task SendWelcomeEmailAsync(string email, string username) =>
        SendEmailAsync(email, "Bienvenido a Aurea", BuildTemplate(new EmailTemplate
        {
            Eyebrow = "Bienvenido a Aurea",
            Title = "Tu experiencia comienza aqui",
            Intro = $"Hola {Encode(username)}, tu correo fue verificado y tu cuenta ya esta lista.",
            ButtonText = "Entrar a Aurea",
            ButtonUrl = FrontendUrl("/login"),
            CardTitle = "Todo en un solo lugar",
            CardBody = "Descubre el menu, reserva tu mesa, crea pedidos y acumula Puntos Aurea.",
            Icon = "&#9733;",
            Note = "Gracias por confiar en Aurea Restaurant.",
        }));

    private string FrontendUrl(string path)
    {
        var baseUrl = configuration["AppSettings:FrontendUrl"]?.TrimEnd('/') ?? "http://localhost:5173";
        return $"{baseUrl}{path}";
    }

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpSettings = configuration.GetSection("SmtpSettings");
        var enabled = bool.Parse(smtpSettings["Enabled"] ?? "false");

        if (!enabled)
        {
            logger.LogWarning(
                "SMTP_DISABLED Recipient={Email} Subject={Subject}",
                to,
                subject);
            return;
        }

        var host = smtpSettings["Host"];
        var port = int.Parse(smtpSettings["Port"] ?? "587");
        var username = smtpSettings["Username"];
        var password = smtpSettings["Password"];
        var fromEmail = smtpSettings["FromEmail"];
        var fromName = smtpSettings["FromName"] ?? "Aurea Restaurant";
        var useImplicitSsl = bool.Parse(smtpSettings["UseImplicitSsl"] ?? "false");
        var ignoreCertificateErrors = bool.Parse(smtpSettings["IgnoreCertificateErrors"] ?? "false");

        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(fromEmail))
        {
            throw new InvalidOperationException("SMTP settings are incomplete. Configure Host, Username, Password and FromEmail.");
        }

        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;
            message.Body = new BodyBuilder { HtmlBody = body }.ToMessageBody();

            using var client = new SmtpClient
            {
                Timeout = int.Parse(smtpSettings["Timeout"] ?? "30000"),
            };

            if (ignoreCertificateErrors)
            {
                client.ServerCertificateValidationCallback = (_, _, _, _) => true;
                client.CheckCertificateRevocation = false;
            }

            var secureSocket = useImplicitSsl || port == 465
                ? SecureSocketOptions.SslOnConnect
                : port == 587
                    ? SecureSocketOptions.StartTls
                    : SecureSocketOptions.Auto;

            await client.ConnectAsync(host, port, secureSocket);
            await client.AuthenticateAsync(username, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            logger.LogInformation(
                "EMAIL_SENT Recipient={Email} Subject={Subject} Host={Host} Port={Port}",
                to,
                subject,
                host,
                port);
        }
        catch (Exception exception)
        {
            logger.LogError(
                exception,
                "EMAIL_FAILED Recipient={Email} Subject={Subject} Host={Host} Port={Port}",
                to,
                subject,
                host,
                port);
            throw;
        }
    }

    private static string Encode(string value) => WebUtility.HtmlEncode(value);

    private string BuildTemplate(EmailTemplate template)
    {
        var contactEmail = Encode(
            configuration["SmtpSettings:FromEmail"] ?? "loscodiguitos26@gmail.com");

        return $"""
<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#050505;color:#f7f1e4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#050505;">
    <tr>
      <td align="center" style="padding:30px 12px;">
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;border:1px solid #3b3120;background:#0b0b0b;">
          <tr>
            <td align="center" style="padding:30px 24px 24px;background:#080808;border-bottom:1px solid #2d2619;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:38px;font-weight:700;letter-spacing:9px;color:#d4af37;">AUREA</div>
              <div style="margin-top:7px;font-size:10px;letter-spacing:4px;color:#8e7a45;">RESTAURANT EXPERIENCE</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0;background:linear-gradient(135deg,#171208,#090909);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:36px 38px 20px;">
                    <div style="display:inline-block;padding:7px 11px;border:1px solid #4d3d1d;color:#e4c96c;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">{template.Eyebrow}</div>
                    <h1 style="margin:20px 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.12;color:#fff8e7;">{template.Title}</h1>
                    <p style="margin:0;color:#cec6b5;font-size:15px;line-height:1.75;">{template.Intro}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 38px 38px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#121212;border:1px solid #292318;">
                <tr>
                  <td width="72" align="center" style="padding:22px 10px;color:#d4af37;font-size:28px;">{template.Icon}</td>
                  <td style="padding:22px 20px 22px 0;">
                    <strong style="display:block;margin-bottom:6px;color:#f7e8b2;font-size:15px;">{template.CardTitle}</strong>
                    <span style="color:#a9a294;font-size:13px;line-height:1.65;">{template.CardBody}</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:26px;">
                <tr>
                  <td align="center" bgcolor="#d4af37">
                    <a href="{template.ButtonUrl}" style="display:inline-block;padding:15px 26px;color:#090909;font-size:13px;font-weight:800;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">{template.ButtonText}</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;padding:15px 17px;border-left:3px solid #d4af37;background:#100e09;color:#9f9786;font-size:12px;line-height:1.65;">{template.Note}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 38px;border-top:1px solid #211d15;background:#080808;color:#756e61;font-size:11px;line-height:1.8;">
              <strong style="color:#b99b48;">Aurea Restaurant</strong><br>
              5ta avenida 12-34, Zona 10, Ciudad de Guatemala<br>
              +502 1234 5678 &nbsp;|&nbsp; {contactEmail}<br>
              <span style="color:#9c8545;">Facebook &nbsp; Instagram &nbsp; WhatsApp</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
""";
    }

    private sealed class EmailTemplate
    {
        public string Eyebrow { get; init; } = string.Empty;
        public string Title { get; init; } = string.Empty;
        public string Intro { get; init; } = string.Empty;
        public string ButtonText { get; init; } = string.Empty;
        public string ButtonUrl { get; init; } = string.Empty;
        public string CardTitle { get; init; } = string.Empty;
        public string CardBody { get; init; } = string.Empty;
        public string Icon { get; init; } = string.Empty;
        public string Note { get; init; } = string.Empty;
    }
}
