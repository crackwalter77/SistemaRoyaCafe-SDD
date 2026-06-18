## 1. Setup del proyecto

- [x] 1.1 Crear estructura de monorepo: backend/, frontend/, docker-compose.yml
- [x] 1.2 Inicializar backend con Node.js + TypeScript + Express (package.json, tsconfig.json)
- [x] 1.3 Inicializar frontend con Vite + React + TypeScript + Tailwind CSS
- [x] 1.4 Crear docker-compose.yml con servicios: db (PostgreSQL 16), backend, frontend
- [x] 1.5 Crear Dockerfile para backend (Node 20 alpine, compilar TS, copiar dist)
- [x] 1.6 Crear Dockerfile para frontend (Node 20 alpine, build con Vite, servir con nginx)
- [x] 1.7 Crear archivo .env.example con variables: DATABASE_URL, JWT_SECRET, ROBOFLOW_API_KEY, ROBOFLOW_MODEL_ID

## 2. Base de datos

- [x] 2.1 Configurar Prisma ORM en backend: schema.prisma con modelos User, Caficultor, Diagnostico
- [x] 2.2 Ejecutar migración inicial de Prisma y generar cliente TypeScript
- [x] 2.3 Crear script seed.ts para datos de prueba (usuario demo, caficultores de ejemplo)
- [x] 2.4 Configurar conexión a PostgreSQL en backend con variable DATABASE_URL

## 3. Backend - Autenticación

- [x] 3.1 Crear auth.controller.ts con handlers: register, login
- [x] 3.2 Crear auth.service.ts con lógica: bcrypt hash/compare, JWT sign/verify
- [x] 3.3 Crear auth.middleware.ts: extraer y validar JWT del header Authorization
- [x] 3.4 Crear auth.routes.ts: POST /api/auth/register, POST /api/auth/login
- [x] 3.5 Crear upload.middleware.ts: configuración de Multer (límite 10MB, solo JPEG/PNG)
- [x] 3.6 Proteger todas las rutas (menos auth) con el middleware JWT

## 4. Backend - CRUD de Caficultores

- [x] 4.1 Crear farmers.controller.ts con handlers: list, create, update, delete (soft)
- [x] 4.2 Crear farmers.service.ts con lógica CRUD y búsqueda por nombre/finca (?q=)
- [x] 4.3 Crear farmers.routes.ts: GET, POST, PUT, DELETE /api/farmers

## 5. Backend - Diagnóstico y clasificación

- [x] 5.1 Crear roboflow.service.ts: función que envía imagen a Roboflow API y retorna predicciones
- [x] 5.2 Crear diagnosis.controller.ts: POST para carga + clasificación, GET list, GET by id
- [x] 5.3 Crear diagnosis.service.ts: crear diagnóstico pendiente, invocar Roboflow, actualizar resultado
- [x] 5.4 Crear diagnosis.routes.ts: GET, GET/:id, POST /api/diagnosis
- [x] 5.5 Integrar Multer en la ruta POST /api/diagnosis para recibir multipart/form-data
- [x] 5.6 Servir imágenes estáticas desde GET /api/uploads/:filename

## 6. Frontend - Configuración y estructura

- [x] 6.1 Configurar Vite proxy hacia backend (localhost:4000) en vite.config.ts
- [x] 6.2 Crear api/client.ts con instancia axios e interceptor para adjuntar token JWT
- [x] 6.3 Crear context/AuthContext.tsx: estado global de autenticación, login/logout, persistencia en localStorage
- [x] 6.4 Crear components/ProtectedRoute.tsx: redirigir a /login si no hay token
- [x] 6.5 Configurar React Router con rutas: /, /login, /register, /diagnosis/new, /diagnosis/:id, /history, /farmers

## 7. Frontend - Autenticación

- [x] 7.1 Crear pages/Login.tsx: formulario de inicio de sesión con email y contraseña
- [x] 7.2 Crear pages/Register.tsx: formulario de registro con nombre, email, contraseña
- [x] 7.3 Crear components/Layout.tsx: navbar con navegación principal y botón de cerrar sesión
- [x] 7.4 Implementar protección de rutas en App.tsx usando ProtectedRoute y AuthContext

## 8. Frontend - Caficultores

- [x] 8.1 Crear pages/Farmers.tsx: listado de caficultores con búsqueda
- [x] 8.2 Crear components/FarmerForm.tsx: modal o formulario para crear/editar caficultor
- [x] 8.3 Implementar llamadas API: listar, crear, actualizar, eliminar caficultores

## 9. Frontend - Diagnóstico y resultados

- [x] 9.1 Crear pages/NewDiagnosis.tsx: formulario con selector de caficultor, input de imagen y botón de carga
- [x] 9.2 Crear components/SeverityBadge.tsx: badge con color según severidad (verde/amarillo/naranja/rojo)
- [x] 9.3 Crear pages/DiagnosisDetail.tsx: vista completa con imagen, resultado, confianza, fecha, caficultor, finca, recomendación
- [x] 9.4 Crear pages/Dashboard.tsx: resumen con últimos diagnósticos del usuario
- [x] 9.5 Implementar flujo completo: cargar imagen → mostrar estado pendiente → mostrar resultado al completarse

## 10. Frontend - Historial

- [x] 10.1 Crear pages/History.tsx: listado paginado de diagnósticos con miniatura, resultado, fecha, caficultor
- [x] 10.2 Crear components/FilterBar.tsx: filtros por fecha, caficultor, finca, resultado, rango de confianza
- [x] 10.3 Implementar navegación desde historial al detalle del diagnóstico
- [x] 10.4 Manejar estados: carga, vacío, error, sin resultados de búsqueda

## 11. Integración Docker y validación final

- [x] 11.1 Probar docker-compose up completo: backend, frontend, DB funcionando
- [x] 11.2 Probar flujo completo: registro → login → crear caficultor → cargar imagen → ver resultado → historial
- [x] 11.3 Verificar almacenamiento persistente de imágenes en volumen Docker
- [x] 11.4 Verificar manejo de errores: Roboflow fallo, token expirado, formato inválido, campos faltantes
