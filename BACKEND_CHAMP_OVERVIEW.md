# Backend TM Aerolineas - Guia Funcional (Area Comercial / CHAMP)

## 1. Objetivo del backend
Este proyecto implementa un backend en Node.js + TypeScript para gestionar:

- usuarios y autenticacion,
- catalogo de reportes comerciales,
- consulta y exposicion de datos operativos/comerciales de carga aerea.

El backend usa MongoDB (via Mongoose) como fuente principal de datos.

## 2. Contexto de aviacion comercial (CHAMP)
Por la estructura de campos y scripts, este backend esta orientado a trabajar con informacion de carga aerea asociada a flujos CHAMP, especialmente:

- AWB (Air Waybill): prefijo, numero AWB, origen/destino, piezas, peso, flete, subtotal, IVA, total, agente, moneda, SHC, etc.
- FSU (Freight Status Update): estados operativos por AWB (timestamp, status, vuelo, origen/destino, etc.).

En esta version del repo, la carga de datos no se obtiene por automatizacion web (Selenium), sino por importacion de archivos CSV hacia MongoDB.

## 3. Stack tecnico
- Runtime: Node.js (ESM)
- Lenguaje: TypeScript
- API: Express
- DB: MongoDB + Mongoose
- Auth: JWT + bcrypt
- Utilidades: exceljs (lectura CSV), dotenv, morgan, cors

Archivo clave: `package.json`

## 4. Estructura general del codigo
```text
src/
  index.ts                 -> inicia app y conecta a Mongo
  app.ts                   -> configura Express y rutas
  core/
    user/                  -> router/controller/service de usuarios
    department/            -> router/controller/service de departamentos
    reports/               -> router/controller/service de reportes
  models/                  -> esquemas Mongoose
  scripts/                 -> seeds e importaciones de datos
  utils/                   -> db, jwt, passwords, parsing CSV, validaciones
  downloads/               -> CSV de entrada para carga masiva
```

## 5. Flujo de arranque
1. `src/index.ts` carga variables de entorno con `dotenv`.
2. Se ejecuta `connectToDatabase()` en `src/utils/db-connection.ts`.
3. Al conectar MongoDB, Express levanta el servidor en `PORT` (o 3000).

## 6. Variables de entorno usadas
El codigo consume estas variables:

- `MONGODB_URI`: cadena de conexion MongoDB.
- `PORT`: puerto del servidor.
- `CLIENT_NAME`: cliente permitido para endpoint externo de datos.
- `API_KEY`: llave del cliente permitido.

No hay `.env` versionado en el repo; deben definirse en entorno local/servidor.

## 7. Modulos de negocio

### 7.1 Usuarios (`/api/users`)
Archivos:
- `src/core/user/user.router.ts`
- `src/core/user/user.controller.ts`
- `src/core/user/user.service.ts`

Capacidades:
- Login (`/signin`) con validacion de password y generacion de JWT.
- Alta, consulta, actualizacion y borrado de usuarios.
- Endpoint `/me` para obtener el usuario autenticado.

### 7.2 Departamentos (`/api/departments`)
Archivos:
- `src/core/department/department.router.ts`
- `src/core/department/department.controller.ts`
- `src/core/department/department.service.ts`

Capacidades actuales:
- Listado de departamentos (`GET /api/departments`).

### 7.3 Reportes (`/api/reports`)
Archivos:
- `src/core/reports/report.router.ts`
- `src/core/reports/report.controller.ts`
- `src/core/reports/report.service.ts`

Capacidades:
- Definir un reporte (`ReportData`) con una o varias hojas (`SheetData`).
- Ejecutar consultas dinamicas por hoja (fields, filtro y orden).
- Listar campos disponibles en colecciones AWB/FSU.
- Exponer datos AWB por API con validacion por headers (`x-client-name`, `x-api-key`).

## 8. Modelo de datos principal

### 8.1 Entidades transaccionales/configuracion
- `User` (`src/models/User.ts`)
- `Department` (`src/models/Department.ts`)
- `ReportData` (`src/models/ReportData.ts`)
- `SheetData` (`src/models/SheetData.ts`)

### 8.2 Entidades de datos operativos/comerciales
- `AwbReportData` (`src/models/AwbReportData.ts`)
- `FsuReportData` (`src/models/FsuReportData.ts`)

Resumen funcional:
- `ReportData` almacena la definicion del reporte.
- Cada `SheetData` define:
  - `collectionName` (por ejemplo `AwbReportData` o `FsuReportData`),
  - `fields` a proyectar,
  - `filterCriteria`,
  - `sortedBy`.
- `generateReports()` ejecuta esa definicion sobre Mongo y devuelve los resultados.

## 9. Origen de datos en esta implementacion
La informacion llega principalmente por scripts:

- `src/scripts/seed.script.ts`:
  - crea departamento inicial,
  - crea usuario admin.
- `src/scripts/get-report-data.script.ts`:
  - importa CSV AWB hacia `AwbReportData`.
- `src/scripts/get-fsu-data.script.ts`:
  - importa CSV FSU hacia `FsuReportData`.
- `src/utils/csv-to-db-service.ts` + `src/utils/extract-csv-data.ts`:
  - parsean CSV y mapean columnas al modelo.

Los CSV se leen desde `src/downloads/`.

## 10. Endpoints principales

### Usuarios
- `POST /api/users/signin`
- `POST /api/users/signup`
- `GET /api/users/me`
- `GET /api/users/`
- `POST /api/users/create`
- `PUT /api/users/update/:id`
- `DELETE /api/users/delete/:id`

### Departamentos
- `GET /api/departments/`

### Reportes
- `POST /api/reports/create`
- `GET /api/reports/generate/:reportId`
- `GET /api/reports/fields`
- `GET /api/reports/all-reports`
- `PUT /api/reports/update/:reportId`
- `DELETE /api/reports/delete/:reportId`
- `GET /api/reports/my-reports`
- `GET /api/reports/all-data`

## 11. Seguridad y control de acceso
- Middleware JWT: `src/utils/validations.ts`
- Firmado/verificacion token: `src/utils/jwt-utils.ts`
- Password hashing: `src/utils/password-utils.ts`
- Validacion de cliente externo por headers: `src/utils/validateHeaders.ts`

Nota operativa:
- Algunas rutas de reportes tienen `validateToken` comentado en el router.
- Conviene revisarlo antes de pasar a produccion.

## 12. Observaciones tecnicas importantes
- El `JWT secret` esta hardcodeado en `src/utils/jwt-utils.ts`.
- `createUser` en controller asigna password fija `"pass123456"` al crear usuarios.
- `createUserDto` incluye `department`, pero el schema `User` no tiene ese campo.
- Hay coexistencia de `Report` y `ReportData`; hoy la logica activa usa `ReportData`.

## 13. Ejecucion local (resumen)
Comandos:

- `npm run dev`: servidor en modo desarrollo.
- `npm run build`: compila TypeScript a `dist`.
- `npm run seed`: siembra usuario/departamento inicial.
- `npm run seed-awb`: importa datos AWB desde CSV.
- `npm run seed-fsu`: importa datos FSU desde CSV.

Prerequisitos:
- MongoDB accesible.
- Variables de entorno definidas.

## 14. Como entenderlo rapido (recomendado)
Orden sugerido para onboarding tecnico:

1. `src/index.ts` y `src/app.ts` (arranque y rutas)
2. `src/core/reports/report.service.ts` (corazon funcional)
3. `src/models/AwbReportData.ts` y `src/models/FsuReportData.ts` (dominio comercial CHAMP)
4. `src/scripts/get-report-data.script.ts` y `src/utils/csv-to-db-service.ts` (ingesta)
5. `src/core/user/*` + `src/utils/jwt-utils.ts` (auth)

---

