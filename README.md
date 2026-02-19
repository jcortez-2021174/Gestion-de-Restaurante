# Gestión de Restaurante – Authentication Service

Este repositorio contiene el **servicio de autenticación** del sistema **Gestión de Restaurante**, desarrollado en **ASP.NET Core** y estructurado bajo una **arquitectura por capas**, con el objetivo de mantener un código limpio, escalable y fácil de mantener.

## Arquitectura del proyecto
La solución está organizada en las siguientes capas:

- **API**  
  Gestiona las solicitudes HTTP, controladores, middlewares, configuración de la aplicación y exposición de endpoints.

- **Application**  
  Contiene la lógica de negocio de la aplicación, servicios, DTOs y contratos que coordinan el flujo entre la API y el dominio.

- **Domain**  
  Define las entidades principales del negocio y las interfaces base, manteniendo independencia de frameworks y tecnologías externas.

- **Persistencia**  
  Implementa el acceso a datos mediante **Entity Framework Core**, incluyendo:
  - `DbContext`
  - Repositorios
  - Seeders de datos
  - Migraciones de base de datos

## Funcionalidades
- Registro de usuarios
- Autenticación y autorización mediante **JWT**
- Gestión de roles
- Validación de credenciales

## Base de datos
- ORM: **Entity Framework Core**
- Migraciones ubicadas en:  
  `GestorRestaurante.Persistencia/Migrations`

## Ejecución del proyecto
1. Configurar la cadena de conexión en `appsettings.json`.
2. Aplicar las migraciones de la base de datos:
   ```bash
   dotnet ef database update
