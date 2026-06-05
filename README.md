# 🏫 San Gabriel App — Sistema de Gestión Académica

Aplicación web full-stack para la Institución Educativa San Gabriel.
Permite a docentes registrar notas y asistencia, a coordinadores aprobar calificaciones y generar boletines, y a acudientes hacer seguimiento al desempeño de sus hijos en tiempo real.

Desarrollada como proyecto de la asignatura **Desarrollo de Aplicaciones Web II** — Corporación Universitaria Iberoamericana.

---

## 🛠️ Tecnologías utilizadas

### Backend
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JSON Web Tokens (JWT)
- Swagger / OpenAPI 3.0
- Nodemailer (notificaciones por correo)

### Frontend
- React 18 + Vite
- React Router v6
- Context API + Hooks (useState, useEffect, useReducer, useContext)
- Axios (peticiones HTTP)
- CSS Modules

---

## 📁 Estructura del proyecto

```
san-gabriel-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Base de datos y Swagger
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Autenticación JWT y roles
│   │   ├── models/         # Modelos Sequelize
│   │   └── routes/         # Rutas REST con documentación OpenAPI
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── context/        # AuthContext (Context API)
    │   ├── hooks/          # Hooks personalizados
    │   ├── pages/          # Vistas por rol
    │   ├── components/     # Componentes reutilizables
    │   └── services/       # Axios + servicios del API
    ├── App.jsx
    └── package.json
```

---

## ⚙️ Instalación local

### Requisitos previos
- Node.js v18 o superior
- PostgreSQL 14 o superior

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/san-gabriel-app.git
cd san-gabriel-app
```

### 2. Configurar el backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con los datos de tu base de datos
npm run dev
```

### 3. Configurar el frontend
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env con la URL del backend
npm run dev
```

### 4. Ver documentación del API
Con el backend corriendo, abre:
```
http://localhost:3001/api-docs
```

---

## 🔐 Roles del sistema

| Rol | Acceso |
|-----|--------|
| Administrador | Gestión de usuarios, configuración global |
| Coordinador | Aprobación de notas, generación de boletines, reportes |
| Docente | Registro de notas y asistencia de sus grupos |
| Acudiente | Consulta del desempeño de su hijo |

---

## 🚀 Despliegue

- **Frontend:** Vercel — [app.sangabriel.edu.co](https://app.sangabriel.edu.co)
- **Backend:** Railway — [api.sangabriel.edu.co](https://api.sangabriel.edu.co)
- **Base de datos:** Supabase (PostgreSQL)
- **Documentación API:** [api.sangabriel.edu.co/api-docs](https://api.sangabriel.edu.co/api-docs)

---

## 👥 Integrantes

- Angie Tatiana Pacalagua Mejia

**Docente:** Mg. Diana Toquica
