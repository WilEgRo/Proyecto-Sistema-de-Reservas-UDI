# Sistema de Reservas y Gestión de Recursos - Centro de Innovación UDI

Este proyecto es una aplicación web Fullstack (MERN + TypeScript) desarrollada para la **Dirección Académica de la UDI**. Su objetivo es modernizar la gestión de reservas del Centro de Innovación y Laboratorios, reemplazando el uso de Excel y WhatsApp.

El sistema permite gestionar el préstamo de salas y equipos sensibles (tablets, kits de robótica, etc.), asegurando la trazabilidad y evitando la doble asignación de recursos.

---

## 🚀 Despliegue (Demo)

- **Frontend (Vercel):** [PEGA_AQUÍ_TU_ENLACE_DE_VERCEL]
- **Backend (Render):** [PEGA_AQUÍ_TU_ENLACE_DE_RENDER]

---

## 🛠️ Tecnologías Utilizadas

El proyecto implementa una arquitectura robusta utilizando **TypeScript** tanto en el cliente como en el servidor.

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt.
- **Frontend:** React (Vite), React Router, Axios, CSS Modules.
- **Infraestructura:** Render (API), Vercel (Cliente), MongoDB Atlas (Base de datos).

---

## 👥 Roles y Funcionalidades

El sistema implementa autenticación segura y autorización basada en roles (RBAC) según los requerimientos del caso:

### 1. Administrador (ADMIN)
- **Gestión de Usuarios:** Creación de cuentas con roles específicos (Admin, Gestor, Docente).
- **Control de Acceso:** Capacidad para **activar o desactivar** cuentas de usuario, impidiendo el acceso al sistema.

### 2. Gestor de Recursos (GESTOR)
- **Inventario:** Registro y actualización de recursos (Salas y Equipos).
- **Gestión de Solicitudes:** Visualización de reservas pendientes con opciones para **Aprobar** o **Rechazar**.
- **Incidencias:** Capacidad para reportar daños (ej. "Impresora obstruida") y marcar recursos como `FUERA_DE_SERVICIO`.

### 3. Docente (DOCENTE)
- **Catálogo:** Visualización de recursos disponibles para reserva.
- **Solicitudes:** Formulario para crear nuevas reservas indicando fecha, hora y propósito.
- **Historial:** Panel personal para ver el estado de sus solicitudes (Pendiente, Aprobada, Rechazada).

---

## ✅ Características Técnicas Destacadas

1.  **Validación de Solapamiento:** El backend impide crear una reserva si el recurso ya está ocupado (APROBADA) en el rango de horario seleccionado.
2.  **Seguridad:**
    - Autenticación vía JWT (JSON Web Tokens).
    - Contraseñas encriptadas con `bcrypt`.
    - Middlewares de protección de rutas por Rol.
3.  **Manejo de Estados:** Flujo completo de estados de reserva (`PENDIENTE` -> `APROBADA` / `RECHAZADA`).
4.  **Optimización:** Uso de `React.lazy` para la carga diferida de módulos según el rol del usuario.

---

## ⚙️ Instalación y Configuración Local
Si deseas ejecutar este proyecto en tu máquina local:
 **Prerrequisitos**
  - Node.js (v16+)
  - MongoDB (URI de conexión)

1. **Clona el repositorio:**
```bash
  git clone <URL_DEL_REPOSITORIO>
  cd sistema-reservas-udi
```
2. **Configura el Backend:**
```bash
  cd server
  npm install
```

 Crea un archivo .env con tus credenciales:
```
  PORT=4000
  MONGODB_URI=mongodb+srv://<usuario>:<pass>@cluster.mongodb.net/udi-db
  JWT_SECRET=<TU_SECRETO_JWT>
```

Poblar la Base de Datos (Seed): Este comando crea usuarios (Admin, Gestor, Docentes) y recursos de prueba.
```bash
  npm run seed
```
Iniciar Servidor:
```bash
  npm run dev
```
3. **Configura el Frontend:**
En una nueva terminal:
```bash
  cd ../client
  npm install
```
Crea un archivo .env apuntando a tu backend local:
```bash
  VITE_API_URL=http://localhost:4000/api
```
iniciar Cliente:
```bash
  npm run dev
```
Credenciales de Prueba (Seed)
| Rol           | Usuario       | Contraseña   |
|:-------------:|:-------------:|:------------:|
| Administrador | admin         | password123  |
| Gestor        | gestor1       | password123  |
| Docente       | docente_juan  | password123  |

---

## 📂 Estructura del Proyecto
```bash
/
├── client/                        # Frontend (React + Vite + TypeScript)
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── components/            # Componentes reutilizables
│       ├── context/               # Contextos (ej. AuthContext)
│       ├── hooks/                 # Hooks personalizados
│       ├── pages/                 # Vistas principales por rol
│       ├── services/              # Configuración de Axios / API
│       ├── styles/                # Estilos globales / utilidades
│       └── main.tsx               # Entrada del app
├── server/                        # Backend (Node.js + Express + TypeScript)
│   ├── .env
│   ├── .env.example
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── controllers/           # Lógica de negocio (peticiones)
│       │   ├── reservation.Controller.ts
│       │   ├── auth.Controller.ts
│       │   ├── resource.Controller.ts
│       │   └── user.Controller.ts
│       ├── middlewares/           # Middlewares (auth, roles)
│       │   ├── checkAuth.ts
│       │   └── checkRole.ts
│       ├── models/                # Esquemas Mongoose
│       │   ├── reservation.Model.ts
│       │   ├── resource.Model.ts
│       │   └── user.Model.ts
│       ├── routes/                # Definición de rutas
│       │   ├── reservation.Routes.ts
│       │   ├── auth.Routes.ts
│       │   ├── resource.Routes.ts
│       │   └── user.Routes.ts
│       ├── index.ts               # Entrada principal (Express app)
│       └── seed.ts                # Script para poblar DB de prueba
├── .gitignore
└── README.md
```