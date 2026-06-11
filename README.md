# Gestión de Restaurante – Authentication Service

Este repositorio contiene el **Servicio de Autenticación e Identidad** del sistema **Gestión de Restaurante Áurea**, desarrollado con **ASP.NET Core**, **Entity Framework Core**, **PostgreSQL**, **JWT**, **Cloudinary** y servicios de correo electrónico SMTP.

Su objetivo es proporcionar una plataforma segura, escalable y mantenible para la gestión de usuarios, autenticación, autorización, perfiles, recuperación de contraseñas y comunicación con los demás microservicios del ecosistema Áurea Restaurant.

---

# Arquitectura del Proyecto

La solución está organizada siguiendo los principios de **Clean Architecture**, separando responsabilidades en distintas capas.

## API

Responsable de:

* Exposición de endpoints HTTP REST.
* Controladores.
* Middlewares.
* Configuración de autenticación y autorización.
* Configuración de JWT.
* Swagger/OpenAPI.
* Integración con servicios externos.

---

## Application

Contiene:

* Lógica de negocio.
* Servicios de aplicación.
* DTOs.
* Interfaces.
* Validaciones.
* Casos de uso.

Actúa como intermediario entre la capa API y el dominio.

---

## Domain

Define:

* Entidades principales.
* Contratos del sistema.
* Interfaces base.
* Reglas de negocio.

Esta capa es completamente independiente de tecnologías externas.

---

## Persistence

Responsable del acceso a datos mediante Entity Framework Core.

Incluye:

* DbContext.
* Repositorios.
* Migraciones.
* Seeders.
* Configuración de entidades.

Ubicación de migraciones:

```text
AuthService.Persistence/Migrations
```

---

# Funcionalidades Implementadas

## Autenticación

* Registro de usuarios.
* Inicio de sesión.
* Cierre de sesión.
* Refresh Tokens.
* JWT Access Tokens.
* Revocación de tokens.
* Gestión de sesiones.

---

## Gestión de Usuarios

* Creación de cuentas.
* Edición de perfiles.
* Consulta de información del usuario autenticado.
* Gestión de roles.
* Administración de usuarios.

---

## Roles y Autorización

Roles soportados:

* ADMIN_ROLE
* USER_ROLE

Características:

* Autorización basada en roles.
* Protección de endpoints.
* Promoción de usuarios a administradores.
* Validación de permisos.

---

## Verificación de Correo Electrónico

* Generación de token de verificación.
* Envío de correo de confirmación.
* Validación de token.
* Reenvío de correos de verificación.

---

## Recuperación de Contraseña

* Solicitud de recuperación.
* Generación de token seguro.
* Envío de enlace por correo.
* Restablecimiento de contraseña.
* Expiración automática de tokens.

---

## Correo Electrónico

Integración SMTP configurable.

Plantillas HTML profesionales para:

* Bienvenida.
* Verificación de correo.
* Recuperación de contraseña.
* Confirmación de cambio de contraseña.

Compatible con:

* Gmail SMTP.
* Mailtrap.
* Outlook.
* Otros proveedores SMTP.

---

## Gestión de Imágenes

Integración con Cloudinary para:

* Avatares de usuarios.
* Imágenes de perfil.
* Almacenamiento optimizado en la nube.

---

## Integración con Restaurant Service

Comunicación segura con el servicio principal mediante:

* Provisionamiento automático de clientes.
* Sincronización de identidades.
* Resolución de usuarios autenticados.

---

# Tecnologías Utilizadas

* ASP.NET Core
* Entity Framework Core
* PostgreSQL
* JWT
* Cloudinary
* MailKit
* Swagger/OpenAPI
* Clean Architecture

---

# Base de Datos

Motor:

* PostgreSQL

Características:

* Migraciones automáticas.
* Seeders.
* Gestión de roles iniciales.
* Gestión de usuarios.
* Refresh Tokens persistentes.

---

# Usuario Administrador Inicial

Cuando la base de datos está vacía, el sistema crea automáticamente un administrador inicial.

Credenciales:

```text
Correo: admin@ksports.local
Usuario: admin
Contraseña: valor de AUREA_INITIAL_ADMIN_PASSWORD
```

Antes del primer inicio de AuthService con una base vacía, configurar una contraseña
fuerte y temporal:

```text
AUREA_INITIAL_ADMIN_PASSWORD=replace_with_a_strong_initial_password
```

La variable solo es necesaria para crear el administrador inicial. Se recomienda
cambiar la contraseña después del primer inicio de sesión.

---

# Promoción de Usuarios a Administrador

Endpoint:

```http
PUT /api/v1/users/{userId}/role
```

Headers:

```http
Authorization: Bearer {JWT_ADMIN}
```

Body:

```json
{
  "roleName": "ADMIN_ROLE"
}
```

Después de ser promovido, el usuario deberá iniciar sesión nuevamente para obtener un JWT actualizado.

---

# Configuración

## Base de Datos

Configurar en:

```json
ConnectionStrings:DefaultConnection
```

---

## JWT

Configurar:

```json
JwtSettings
{
  "SecretKey": "",
  "Issuer": "",
  "Audience": "",
  "ExpirationInMinutes": 1440
}
```

---

## SMTP

Configurar:

```json
SmtpSettings
{
  "Host": "",
  "Port": 587,
  "Username": "",
  "Password": "",
  "FromEmail": "",
  "FromName": "Aurea Restaurant"
}
```

---

## Cloudinary

Configurar:

```json
CloudinarySettings
{
  "CloudName": "",
  "ApiKey": "",
  "ApiSecret": "",
  "Folder": "auth_service/profiles"
}
```

---

# Ejecución del Proyecto

## Restaurar dependencias

```bash
dotnet restore
```

## Aplicar migraciones

```bash
dotnet ef database update
```

## Ejecutar el proyecto

```bash
dotnet run
```

---

# Seguridad

El sistema implementa:

* JWT Authentication.
* Refresh Tokens.
* Password Hashing.
* Protección por roles.
* Validación de tokens.
* Revocación de sesiones.
* Recuperación segura de contraseñas.
* Verificación de correo electrónico.

---

# Estado del Proyecto

Versión actual:

```text
Release Candidate 2026
```

Características verificadas:

* Registro
* Login
* Logout
* Refresh Token
* Verificación de correo
* Recuperación de contraseña
* Gestión de roles
* SMTP
* Cloudinary
* JWT
* PostgreSQL
* Integración con Restaurant Service

---

# Licencia

Este proyecto está bajo la licencia MIT.

---

# Créditos

## Profesor Braulio Echeverría

Parte del proyecto utiliza conceptos, estructuras y fragmentos académicos proporcionados durante el proceso formativo.

## Mauricio Xocoxic

Utilizó parcialmente código proporcionado por el profesor Braulio Echeverría para la configuración de Docker Compose.

## Carlos Sanches

Utilizó parcialmente código proporcionado por el profesor Braulio Echeverría en la entidad de Reservación, específicamente en el modelo y controlador, adaptados posteriormente a las necesidades del proyecto.

## Equipo de Desarrollo

Proyecto desarrollado para el sistema Gestión de Restaurante Áurea como parte del proceso académico y profesional de Ingeniería en Sistemas.
