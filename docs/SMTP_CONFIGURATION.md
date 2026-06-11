# Configuracion SMTP de Aurea

Aurea utiliza dos emisores configurables:

- AuthService (.NET): verificacion, bienvenida y recuperacion de cuenta.
- Restaurant Service (Node.js): pedidos, reservaciones y recompensas.

No se deben guardar credenciales reales en Git.

Los secretos de JWT, PostgreSQL, SMTP, Cloudinary y provisioning deben
configurarse mediante variables de entorno, User Secrets o el gestor de secretos
de la plataforma de despliegue.

## AuthService

Configurar `SmtpSettings` mediante variables de entorno o secretos de .NET:

```text
SmtpSettings__Enabled=true
SmtpSettings__Host=smtp.gmail.com
SmtpSettings__Port=587
SmtpSettings__Username=cuenta@gmail.com
SmtpSettings__Password=app-password
SmtpSettings__FromEmail=cuenta@gmail.com
SmtpSettings__FromName=Aurea Restaurant
SmtpSettings__UseImplicitSsl=false
SmtpSettings__IgnoreCertificateErrors=false
```

Para desarrollo local también puede utilizarse `dotnet user-secrets`:

```text
dotnet user-secrets set "SmtpSettings:Username" "cuenta@gmail.com" --project src/AuthService.Api
dotnet user-secrets set "SmtpSettings:Password" "app-password" --project src/AuthService.Api
dotnet user-secrets set "SmtpSettings:FromEmail" "cuenta@gmail.com" --project src/AuthService.Api
```

Para Outlook usar `smtp.office365.com:587`. Para Mailtrap, copiar host, puerto,
usuario y password del inbox de desarrollo.

## Restaurant Service

Configurar `auth-node/.env`:

```text
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=cuenta@gmail.com
SMTP_PASS=app-password
SMTP_FROM_EMAIL=cuenta@gmail.com
SMTP_FROM_NAME=Aurea Restaurant
FRONTEND_URL=http://localhost:5173
```

Para puerto `465`, establecer `SMTP_SECURE=true`.

## Verificacion

1. Registrar una cuenta nueva.
2. Confirmar que llega el correo de verificacion.
3. Solicitar recuperacion en `/forgot-password`.
4. Crear un pedido y una reservacion con un Cliente que tenga correo.
5. Revisar la coleccion `notificacions` para estados `ENVIADA` o `ERROR`.

Con SMTP desactivado, AuthService registra el intento y Restaurant Service
conserva la notificacion como `PENDIENTE`.
