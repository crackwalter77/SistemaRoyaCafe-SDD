## ADDED Requirements

### Requirement: Registro de Ingeniero Agrónomo

El sistema SHOULD permitir que un Ingeniero Agrónomo se registre proporcionando nombre, correo electrónico y contraseña. La contraseña SHALL ser almacenada con hash seguro (bcrypt).

#### Scenario: Registro exitoso

- **WHEN** el usuario envía nombre, email y contraseña válidos al endpoint `/api/auth/register`
- **THEN** el sistema crea el usuario, retorna un código 201 y un mensaje de confirmación

#### Scenario: Registro con email duplicado

- **WHEN** el usuario envía un email que ya existe en la base de datos
- **THEN** el sistema retorna un error 409 con mensaje "El email ya está registrado"

### Requirement: Inicio de sesión (Login)

El sistema SHALL autenticar al Ingeniero Agrónomo mediante correo electrónico y contraseña, retornando un token JWT válido por 24 horas.

#### Scenario: Login exitoso

- **WHEN** el usuario envía email y contraseña correctos al endpoint `/api/auth/login`
- **THEN** el sistema retorna un token JWT y los datos básicos del usuario

#### Scenario: Login con credenciales inválidas

- **WHEN** el usuario envía email o contraseña incorrectos
- **THEN** el sistema retorna un error 401 con mensaje "Credenciales inválidas"

### Requirement: Protección de rutas

El sistema SHALL proteger todas las rutas de la API (excepto registro y login) mediante middleware que valide el token JWT en el header `Authorization: Bearer <token>`.

#### Scenario: Acceso con token válido

- **WHEN** el usuario envía una solicitud a una ruta protegida con un token JWT válido
- **THEN** el sistema procesa la solicitud normalmente

#### Scenario: Acceso sin token

- **WHEN** el usuario envía una solicitud a una ruta protegida sin header Authorization
- **THEN** el sistema retorna un error 401 con mensaje "Token no proporcionado"

#### Scenario: Acceso con token expirado

- **WHEN** el usuario envía una solicitud con un token JWT expirado
- **THEN** el sistema retorna un error 401 con mensaje "Token expirado"
