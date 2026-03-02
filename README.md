##Gestión de Restaurante – Authentication Service

Este repositorio contiene el Servicio de Autenticación del sistema Gestión de Restaurante, desarrollado con ASP.NET Core y estructurado bajo una arquitectura por capas.

El objetivo principal de este servicio es garantizar un sistema seguro, escalable y mantenible para la gestión de usuarios, autenticación y autorización dentro de la plataforma.

# Arquitectura del Proyecto

La solución está organizada siguiendo una arquitectura limpia (Clean Architecture), separando responsabilidades en distintas capas:

# API

Encargada de:

Exposición de endpoints HTTP

Controladores

Middlewares

Configuración de la aplicación

Manejo de autenticación y autorización

## Application

Contiene:

Lógica de negocio

Servicios

DTOs

Interfaces y contratos

Validaciones

Actúa como intermediario entre la capa API y el dominio.

## Domain

Define:

Entidades principales del negocio

Interfaces base

Reglas fundamentales del sistema

Esta capa es independiente de frameworks externos.

## Persistencia

Responsable del acceso a datos utilizando Entity Framework Core.

Incluye:

- DbContext

- Implementación de repositorios

- Seeders de datos

- Migraciones de base de datos

- Ubicación de migraciones:

## GestorRestaurante.Persistencia/Migrations
 Funcionalidades

- Registro de usuarios

- Inicio de sesión

- Autenticación mediante JWT

- Autorización basada en roles

- Validación segura de credenciales

- Gestión de roles

## Base de Datos

ORM: Entity Framework Core

Sistema de migraciones integrado

Configuración mediante appsettings.json

## Ejecución del Proyecto
 Configurar la cadena de conexión

Editar el archivo:

appsettings.json

Y establecer la cadena de conexión correspondiente.

 Aplicar migraciones

Ejecutar en la terminal:

dotnet ef database update
3️## Ejecutar el proyecto
- dotnet run
## Seguridad

El sistema implementa:

Generación y validación de tokens JWT

Protección de endpoints mediante autorización por roles

Manejo seguro de contraseñas

## Licencia

Este proyecto está bajo la licencia MIT.


## Creaditos al codigo del profesor Braulio Echeverria 
- Maurio Xocoxic: utilizó parte del código proporcionado por el profesor Braulio Echeverría, específicamente en la configuración del archivo docker-compose.


