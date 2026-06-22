## ADDED Requirements

### Requirement: Carga de imagen de hoja de café

El sistema SHALL permitir al Ingeniero Agrónomo autenticado cargar una imagen de hoja de café en formato JPEG o PNG, con un tamaño máximo de 10 MB. La imagen SHALL ser almacenada en el sistema de archivos local dentro de un volumen Docker.

#### Scenario: Carga exitosa de imagen

- **WHEN** el usuario autenticado envía una imagen JPEG/PNG válida (menor a 10 MB) al endpoint `/api/diagnosis` junto con el ID del caficultor y finca
- **THEN** el sistema guarda la imagen, retorna un código 201 y un ID de diagnóstico pendiente

#### Scenario: Carga con formato inválido

- **WHEN** el usuario envía un archivo que no es JPEG ni PNG
- **THEN** el sistema retorna un error 400 con mensaje "Formato de imagen no soportado. Use JPEG o PNG"

#### Scenario: Carga con tamaño excedido

- **WHEN** el usuario envía un archivo mayor a 10 MB
- **THEN** el sistema retorna un error 400 con mensaje "La imagen excede el tamaño máximo de 10 MB"

### Requirement: Gestión de imagen en frontend

El sistema SHOULD permitir al usuario gestionar la imagen seleccionada antes de enviarla:
- Botón para seleccionar/cambiar imagen
- Botón para quitar/eliminar la imagen cargada
- Previsualización clara de la imagen antes del análisis

#### Scenario: Cambiar imagen seleccionada

- **WHEN** el usuario selecciona una imagen y luego hace clic en "Cambiar imagen"
- **THEN** el sistema abre el selector de archivos y permite reemplazar la imagen

#### Scenario: Quitar imagen seleccionada

- **WHEN** el usuario hace clic en "Quitar imagen"
- **THEN** el sistema elimina la previsualización y reinicia el estado de selección

### Requirement: Clasificación automática con Roboflow YOLO

El sistema SHALL enviar la imagen cargada a la API de Roboflow Inference para clasificarla utilizando el modelo YOLO entrenado. El sistema SHALL clasificar el resultado en una de cuatro categorías: `Sana`, `Leve`, `Moderado` o `Severo`. La confianza del modelo SHALL ser almacenada como porcentaje.

#### Scenario: Clasificación exitosa

- **WHEN** el sistema recibe la respuesta de Roboflow API con una predicción válida
- **THEN** el sistema almacena el resultado (clase con mayor confianza) y el porcentaje de confianza en la base de datos

#### Scenario: Error en la API de Roboflow

- **WHEN** la API de Roboflow retorna un error o timeout
- **THEN** el sistema marca el diagnóstico como "Error" y guarda el mensaje de error para reintento manual

#### Scenario: Imagen con cabeceras MIME corruptas

- **WHEN** la imagen almacenada contiene cabeceras MIME adicionales (por malformación en multipart)
- **THEN** el sistema limpia automáticamente el buffer eliminando cabeceras no pertenecientes a la imagen

#### Scenario: Fallback de endpoint Roboflow

- **WHEN** el endpoint `detect.roboflow.com` falla
- **THEN** el sistema reintenta automáticamente con `classify.roboflow.com`

### Requirement: Asociación de diagnóstico con caficultor y finca

El sistema SHALL requerir que cada diagnóstico esté asociado a un caficultor registrado y su finca correspondiente. Estos datos SHOULD ser seleccionables desde un listado de caficultores existentes.

#### Scenario: Diagnóstico con caficultor existente

- **WHEN** el usuario selecciona un caficultor existente y carga una imagen
- **THEN** el sistema asocia el diagnóstico al caficultor y finca seleccionados

#### Scenario: Diagnóstico sin caficultor

- **WHEN** el usuario intenta cargar una imagen sin seleccionar un caficultor
- **THEN** el sistema retorna un error 400 con mensaje "Debe seleccionar un caficultor"

#### Scenario: Diagnóstico sin caficultores registrados

- **WHEN** el usuario accede al formulario de diagnóstico sin tener caficultores registrados
- **THEN** el sistema muestra un mensaje: "No puede realizar el diagnóstico. Primero debe registrar el Ingeniero Agrónomo, Caficultor y Finca correspondiente."
