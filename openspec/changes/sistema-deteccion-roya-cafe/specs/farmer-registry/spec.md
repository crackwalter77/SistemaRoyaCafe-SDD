## ADDED Requirements

### Requirement: Registro de caficultor

El sistema SHALL permitir al Ingeniero Agrónomo autenticado registrar un nuevo caficultor con los siguientes datos: nombre completo, nombre de la finca, ubicación (departamento/municipio), teléfono y correo electrónico.

#### Scenario: Registro exitoso de caficultor

- **WHEN** el usuario autenticado envía todos los datos requeridos del caficultor al endpoint POST `/api/farmers`
- **THEN** el sistema crea el registro y retorna un código 201 con los datos del caficultor creado

#### Scenario: Registro con datos incompletos

- **WHEN** el usuario envía datos sin completar campos requeridos (nombre, finca)
- **THEN** el sistema retorna un error 400 con mensaje "Los campos nombre y finca son obligatorios"

### Requirement: Listado de caficultores

El sistema SHALL mostrar un listado de todos los caficultores registrados por el Ingeniero Agrónomo autenticado, con la posibilidad de buscar por nombre o finca.

#### Scenario: Listado de caficultores

- **WHEN** el usuario autenticado solicita GET `/api/farmers`
- **THEN** el sistema retorna la lista de caficultores registrados asociados a su cuenta

#### Scenario: Búsqueda de caficultor

- **WHEN** el usuario ingresa un término de búsqueda en el campo de búsqueda
- **THEN** el sistema retorna los caficultores cuyo nombre o finca coincidan parcialmente con el término

### Requirement: Actualización de caficultor

El sistema SHALL permitir al Ingeniero Agrónomo autenticado actualizar los datos de un caficultor existente.

#### Scenario: Actualización exitosa

- **WHEN** el usuario autenticado envía datos actualizados al endpoint PUT `/api/farmers/:id`
- **THEN** el sistema actualiza el registro y retorna los datos modificados

#### Scenario: Actualización de caficultor inexistente

- **WHEN** el usuario intenta actualizar un caficultor con ID que no existe
- **THEN** el sistema retorna un error 404 con mensaje "Caficultor no encontrado"

### Requirement: Eliminación de caficultor

El sistema SHALL permitir al Ingeniero Agrónomo autenticado eliminar un caficultor. La eliminación SHALL ser lógica (soft delete) para preservar la integridad de los diagnósticos asociados.

#### Scenario: Eliminación exitosa

- **WHEN** el usuario autenticado envía DELETE `/api/farmers/:id`
- **THEN** el sistema marca el caficultor como eliminado (sin borrar físicamente) y retorna código 200

#### Scenario: Eliminación de caficultor con diagnósticos

- **WHEN** el usuario elimina un caficultor que tiene diagnósticos asociados
- **THEN** el sistema realiza soft delete y los diagnósticos permanecen visibles en el historial
