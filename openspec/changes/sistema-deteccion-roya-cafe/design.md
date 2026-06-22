## Context

Sistema web académico local para detección temprana de roya en hojas de café. Un Ingeniero Agrónomo se autentica, carga imágenes de hojas, el sistema las clasifica en 4 niveles vía Roboflow YOLO, y almacena diagnósticos asociados a caficultores y fincas. Despliegue con Docker Compose.

Actores: Ingeniero Agrónomo (único rol). Sin multi-tenant ni escalado horizontal.

## Goals / Non-Goals

**Goals:**
- Autenticación JWT con registro y login
- Carga de imágenes JPEG/PNG (máx 10 MB) con almacenamiento local en volumen Docker
- Clasificación automática en Sana, Leve, Moderado, Severo mediante Roboflow API
- CRUD de caficultores con soft delete
- Historial de diagnósticos con paginación y filtros combinados
- Visualización de resultados con indicadores de severidad por color
- Todo el sistema funcional con `docker compose up`

**Non-Goals:**
- Multi-tenant (soporte para múltiples Ingenieros Agrónomos sin compartir datos)
- Escalado horizontal o balanceo de carga
- Despliegue en producción o nube
- Aplicación móvil nativa
- Entrenamiento del modelo YOLO (se consume vía API ya entrenado)
- Notificaciones en tiempo real
- Roles de usuario múltiples

## Decisions

### Arquitectura general

Monorepo con dos servicios en Docker Compose:

```
docker-compose.yml
├── service: backend (Node.js + Express + TypeScript) → puerto 4000
├── service: frontend (React + TypeScript + Vite + Tailwind) → puerto 5173
└── service: db (PostgreSQL 16) → puerto 5432
```

Frontend y backend se comunican vía REST. El frontend en desarrollo usa Vite proxy; en producción se sirve desde nginx o Express static.

### Estructura de directorios

```
sistema-roya-cafe/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.ts              # Entry point, Express app
│   │   ├── config/
│   │   │   └── env.ts            # Variables de entorno (Roboflow key, JWT secret, DB URL)
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT verification middleware
│   │   │   └── upload.ts         # Multer config
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── diagnosis.routes.ts
│   │   │   └── farmers.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── diagnosis.controller.ts
│   │   │   └── farmers.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── diagnosis.service.ts
│   │   │   ├── roboflow.service.ts
│   │   │   └── farmers.service.ts
│   │   └── types/
│   │       └── index.ts
│   └── uploads/                  # Almacenamiento local de imágenes (volumen Docker)
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/
│       │   └── client.ts         # axios instance con interceptors JWT
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── components/
│       │   ├── Layout.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── SeverityBadge.tsx
│       │   ├── DiagnosisCard.tsx
│       │   ├── FarmerForm.tsx
│       │   └── FilterBar.tsx
│       ├── pages/
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   ├── Dashboard.tsx
│       │   ├── NewDiagnosis.tsx
│       │   ├── DiagnosisDetail.tsx
│       │   ├── History.tsx
│       │   ├── Farmers.tsx
│       │   └── Users.tsx
│       └── types/
│           └── index.ts
```

### Modelo de datos (Prisma)

```prisma
model User {
  id           Int           @id @default(autoincrement())
  name         String
  email        String        @unique
  passwordHash String
  role         String        @default("agronomist")
  createdAt    DateTime      @default(now())
  farmers      Caficultor[]
  diagnoses    Diagnostico[]
}

model Caficultor {
  id           Int           @id @default(autoincrement())
  nombre       String
  finca        String
  ubicacion    String?
  telefono     String?
  email        String?
  activo       Boolean       @default(true)
  createdAt    DateTime      @default(now())
  userId       Int
  user         User          @relation(fields: [userId], references: [id])
  diagnoses    Diagnostico[]
}

model Diagnostico {
  id            Int           @id @default(autoincrement())
  imageUrl      String
  resultado     String        // "Sana" | "Leve" | "Moderado" | "Severo" | "Error"
  confianza     Float?
  fecha         DateTime      @default(now())
  notas         String?
  userId        Int
  user          User          @relation(fields: [userId], references: [id])
  caficultorId  Int
  caficultor    Caficultor    @relation(fields: [caficultorId], references: [id])
}
```

### API REST

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Registrar Ingeniero Agrónomo |
| POST | `/api/auth/login` | No | Iniciar sesión, retorna JWT |
| GET | `/api/farmers` | Sí | Listar caficultores (con búsqueda ?q=) |
| POST | `/api/farmers` | Sí | Crear caficultor |
| PUT | `/api/farmers/:id` | Sí | Actualizar caficultor |
| DELETE | `/api/farmers/:id` | Sí | Soft delete caficultor |
| GET | `/api/diagnosis` | Sí | Listar diagnósticos (paginado, filtros) |
| GET | `/api/diagnosis/:id` | Sí | Detalle de diagnóstico |
| POST | `/api/diagnosis` | Sí | Cargar imagen + crear diagnóstico (multipart) |
| DELETE | `/api/diagnosis/:id` | Sí | Eliminar diagnóstico y su imagen |
| GET | `/api/uploads/:filename` | Sí | Servir imagen almacenada |
| GET | `/api/users` | Sí | Listar Ingenieros Agrónomos |
| POST | `/api/users` | Sí | Crear Ingeniero Agrónomo |
| PUT | `/api/users/:id` | Sí | Actualizar Ingeniero Agrónomo |
| DELETE | `/api/users/:id` | Sí | Eliminar Ingeniero Agrónomo |

Filtros en GET `/api/diagnosis`:
- `page` (int, default 1), `limit` (int, default 10)
- `fechaDesde`, `fechaHasta` (ISO date)
- `caficultor` (string, búsqueda parcial)
- `finca` (string, búsqueda parcial)
- `resultado` (enum: Sana|Leve|Moderado|Severo)
- `confianzaMin`, `confianzaMax` (float 0-100)

### Flujo de carga y clasificación

```
[Usuario] → Sube imagen + selecciona caficultor
    ↓
[Express] → Multer valida formato/tamaño → guarda en /uploads
    ↓
[Express] → Crea Diagnostico con resultado="pendiente"
    ↓
[Express] → RoboflowService.classifyImage(imageBuffer)
    ↓
  ├─ cleanImageBuffer() → busca cabeceras MIME y las elimina
  ├─ Intenta endpoint detect.roboflow.com
  │   └─ Si falla → fallback a classify.roboflow.com
  └─ Extrae predicción con mayor confianza
    ↓
[Express] → Actualiza Diagnostico con resultado y confianza
    ↓
[Express] → Retorna resultado al frontend
```

### Autenticación JWT

- Registro: bcrypt hash (salt rounds 10) + insert en DB
- Login: bcrypt compare + firma JWT con `jwt.sign({ userId, email, role }, SECRET, { expiresIn: '24h' })`
- Middleware: extrae token de `Authorization: Bearer <token>`, verifica con `jwt.verify`, agrega `req.user`
- Frontend: AuthContext almacena token en localStorage, axios interceptor lo adjunta automáticamente

### Frontend - Componentes y rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/login` | Login | Formulario de inicio de sesión con toggle de visibilidad de contraseña |
| `/register` | Register | Formulario de registro con toggle de visibilidad de contraseña |
| `/` | Dashboard | Resumen: últimos diagnósticos, acceso rápido |
| `/diagnosis/new` | NewDiagnosis | Cargar imagen + seleccionar caficultor; botones cambiar/quitar imagen; validación de prerequisitos |
| `/diagnosis/:id` | DiagnosisDetail | Ver resultado con barra de confianza, indicador de severidad y recomendación con borde de color |
| `/history` | History | Historial con filtros y botón de eliminar en cada tarjeta |
| `/farmers` | Farmers | CRUD de caficultores con validación de teléfono (10 dígitos) |
| `/users` | Users | CRUD de Ingenieros Agrónomos con toggle de visibilidad de contraseña |

### Docker Compose

```yaml
version: "3.8"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: roya_cafe
      POSTGRES_USER: roya_user
      POSTGRES_PASSWORD: roya_pass
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://roya_user:roya_pass@db:5432/roya_cafe
      JWT_SECRET: ${JWT_SECRET}
      ROBOFLOW_API_KEY: ${ROBOFLOW_API_KEY}
      ROBOFLOW_MODEL_ID: ${ROBOFLOW_MODEL_ID}
    volumes:
      - uploads:/app/uploads
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  pgdata:
  uploads:
```

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `ROBOFLOW_API_KEY` | API key de Roboflow |
| `ROBOFLOW_MODEL_ID` | ID del modelo YOLO en Roboflow |

## Riesgos / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| [Dependencia externa] Roboflow API puede estar caída o lenta | El sistema maneja errores gracefully, marca diagnóstico como "Error" y permite reintentar |
| [Seguridad] Imágenes de hojas subidas por usuarios podrían contener datos sensibles | Validación estricta de tipo MIME, sanitización de nombres de archivo, sin acceso público a uploads |
| [Performance] Imágenes grandes (10 MB) pueden saturar memoria al procesarse | Multer configurado con `limits.fileSize`, se usa streams para Roboflow |
| [Persistencia] Volumen Docker de imágenes no se respalda automáticamente | Aceptado para fines académicos; en producción se usaría S3 |
| [Modelo] Falsos positivos/negativos del YOLO | Se muestra la confianza al usuario para que tome decisión informada |

## Open Questions

- ¿Puerto del frontend en producción? Vite dev usa 5173, pero en producción con Docker se podría servir desde Express o nginx en el mismo puerto que backend (4000). Decisión: para fines académicos mantener separado.
- ¿Formato de respuesta de Roboflow? Depende del modelo exportado. Se asume respuesta estándar de Roboflow Inference API `{ predictions: [{ class, confidence, ... }] }`. Verificar con el modelo desplegado.
