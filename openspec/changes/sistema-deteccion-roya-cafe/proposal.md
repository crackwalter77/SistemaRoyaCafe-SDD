## Why

La roya del café (Hemileia vastatrix) es una enfermedad que causa pérdidas significativas en los cultivos de café a nivel mundial. Los Ingenieros Agrónomos necesitan una herramienta digital local que, mediante el análisis de imágenes de hojas con un modelo YOLO entrenado en Roboflow, permita clasificar automáticamente el nivel de infección —Sana, Leve, Moderado o Severo— para tomar decisiones fitosanitarias tempranas y reducir el impacto en la producción.

## What Changes

- Sistema web completo para detección temprana de roya en hojas de café mediante IA
- Autenticación local con JWT para Ingenieros Agrónomos
- Carga de imágenes de hojas de café al servidor local
- Clasificación automática en 4 niveles (Sana, Leve, Moderado, Severo) vía Roboflow API
- Almacenamiento de cada diagnóstico con: imagen, resultado, confianza, fecha, caficultor y finca
- Historial completo de diagnósticos con búsqueda y filtros
- Registro y gestión de datos de caficultores
- CRUD completo de Ingenieros Agrónomos
- Despliegue local con Docker Compose (app + PostgreSQL)

## Capabilities

### New Capabilities
- `authentication`: Autenticación y gestión de sesiones para Ingenieros Agrónomos mediante JWT, con toggle de visibilidad de contraseña
- `image-diagnosis`: Carga de imágenes de hojas de café y clasificación automática usando Roboflow YOLO API, con previsualización y gestión de imagen
- `results-view`: Visualización de resultados de diagnóstico con niveles de severidad, barra de confianza y recomendaciones fitosanitarias
- `diagnostic-history`: Historial de diagnósticos realizados con capacidad de búsqueda, filtrado, eliminación y exportación
- `farmer-registry`: Registro y gestión de datos de caficultores (nombre, finca, ubicación, contacto) con validación de teléfono
- `user-management`: CRUD completo de Ingenieros Agrónomos con validación de campos

### Modified Capabilities

*(Ninguna — no existen capacidades previas)*

## Impact

- Nuevo proyecto full-stack: Backend Node.js + Express, Frontend React + TypeScript
- Integración con Roboflow Inference API para clasificación YOLO
- Almacenamiento local de imágenes en volumen Docker
- Base de datos PostgreSQL con Prisma ORM
- Contenedorización con Docker Compose
- Nuevas dependencias: `express`, `prisma`, `react`, `jsonwebtoken`, `multer`, `axios`
