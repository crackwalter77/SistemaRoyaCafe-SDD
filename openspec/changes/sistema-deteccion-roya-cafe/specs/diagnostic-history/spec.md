## ADDED Requirements

### Requirement: Listado de diagnósticos

El sistema SHALL mostrar un listado paginado de todos los diagnósticos realizados por el Ingeniero Agrónomo autenticado, ordenados por fecha descendente. Cada elemento SHALL mostrar: imagen en miniatura, resultado, confianza, fecha, caficultor y finca.

#### Scenario: Listado paginado exitoso

- **WHEN** el usuario autenticado solicita GET `/api/diagnosis?page=1&limit=10`
- **THEN** el sistema retorna una lista paginada de diagnósticos con metadatos de paginación (total, página, límite)

#### Scenario: Listado vacío

- **WHEN** el usuario autenticado no tiene diagnósticos registrados
- **THEN** el sistema retorna una lista vacía con mensaje "No hay diagnósticos registrados"

### Requirement: Búsqueda y filtros

El sistema SHALL permitir filtrar diagnósticos por: rango de fechas, nombre de caficultor, nombre de finca, nivel de resultado (Sana, Leve, Moderado, Severo) y rango de confianza.

#### Scenario: Filtro por resultado

- **WHEN** el usuario aplica un filtro con resultado="Severo"
- **THEN** el sistema retorna solo los diagnósticos clasificados como "Severo"

#### Scenario: Filtro combinado

- **WHEN** el usuario aplica filtros de fecha y caficultor simultáneamente
- **THEN** el sistema retorna los diagnósticos que cumplen ambas condiciones

#### Scenario: Búsqueda sin resultados

- **WHEN** el usuario aplica filtros que no coinciden con ningún diagnóstico
- **THEN** el sistema retorna una lista vacía con mensaje "No se encontraron diagnósticos con los filtros aplicados"

### Requirement: Detalle de diagnóstico

El sistema SHALL permitir acceder al detalle completo de un diagnóstico desde el historial mediante clic en el elemento del listado.

#### Scenario: Navegación a detalle

- **WHEN** el usuario hace clic en un diagnóstico del listado
- **THEN** el sistema redirige a la vista de detalle del diagnóstico seleccionado
