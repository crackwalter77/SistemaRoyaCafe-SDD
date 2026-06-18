## ADDED Requirements

### Requirement: Visualización de resultado individual

El sistema SHALL mostrar el resultado completo de un diagnóstico incluyendo: imagen original, nivel de severidad (`Sana`, `Leve`, `Moderado`, `Severo`), porcentaje de confianza, fecha del diagnóstico, nombre del caficultor y finca asociada.

#### Scenario: Visualización de diagnóstico existente

- **WHEN** el usuario autenticado solicita un diagnóstico por su ID mediante GET `/api/diagnosis/:id`
- **THEN** el sistema retorna todos los datos del diagnóstico incluyendo la URL de la imagen, resultado, confianza, fecha, caficultor y finca

#### Scenario: Visualización de diagnóstico inexistente

- **WHEN** el usuario solicita un ID de diagnóstico que no existe
- **THEN** el sistema retorna un error 404 con mensaje "Diagnóstico no encontrado"

### Requirement: Indicador visual de severidad

El sistema SHALL mostrar un indicador visual (color o ícono) diferenciado para cada nivel de severidad: verde para `Sana`, amarillo para `Leve`, naranja para `Moderado` y rojo para `Severo`. El porcentaje de confianza SHALL mostrarse junto al resultado.

#### Scenario: Visualización de resultado Sana

- **WHEN** el resultado del diagnóstico es "Sana"
- **THEN** el sistema muestra un indicador verde con el texto "Sana" y el porcentaje de confianza

#### Scenario: Visualización de resultado Severo

- **WHEN** el resultado del diagnóstico es "Severo"
- **THEN** el sistema muestra un indicador rojo con el texto "Severo" y el porcentaje de confianza

### Requirement: Interpretación del resultado

El sistema SHOULD mostrar una breve descripción textual del significado del nivel de severidad y una recomendación fitosanitaria general basada en el resultado obtenido.

#### Scenario: Visualización con recomendación

- **WHEN** el usuario ve el resultado de un diagnóstico clasificado como "Moderado"
- **THEN** el sistema muestra junto al resultado un texto explicativo con recomendaciones para el nivel moderado de infección
