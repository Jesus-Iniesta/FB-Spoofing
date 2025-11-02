# FB-Spoofing Backend API

## 🗄️ Base de datos PostgreSQL implementada

### Estructura del proyecto

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de PostgreSQL
│   ├── controllers/
│   │   └── authController.js    # Controladores de autenticación
│   ├── middlewares/
│   │   ├── errorHandler.js      # Manejo de errores
│   │   ├── logger.js            # Logger de peticiones
│   │   └── validateUser.js      # Validación de usuarios
│   ├── models/
│   │   └── User.js              # Modelo de Usuario
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   └── index.js             # Rutas principales
│   └── app.js                   # Configuración de Express
├── index.js                     # Punto de entrada
├── .env                         # Variables de entorno
└── package.json
```

### 📋 Tablas creadas automáticamente

#### **usuarios**
- `id` - SERIAL PRIMARY KEY
- `email` - VARCHAR(255) UNIQUE NOT NULL
- `password` - VARCHAR(255) NOT NULL (hasheada con bcrypt)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

#### **sessions**
- `id` - SERIAL PRIMARY KEY
- `user_id` - INTEGER (FK a usuarios)
- `token` - VARCHAR(500) UNIQUE
- `ip_address` - VARCHAR(50)
- `user_agent` - TEXT
- `created_at` - TIMESTAMP
- `expires_at` - TIMESTAMP

### 🚀 Endpoints disponibles

#### **POST /api/auth/register**
Registra un nuevo usuario guardando email y contraseña hasheada.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "mipassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "created_at": "2025-11-01T..."
  }
}
```

#### **POST /api/auth/login**
Inicia sesión y guarda información de la sesión (IP, user agent).

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "mipassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "session": {
      "user_id": 1,
      "email": "usuario@ejemplo.com",
      "ip_address": "172.18.0.1",
      "user_agent": "Mozilla/5.0..."
    }
  }
}
```

#### **GET /api/auth/users**
Obtiene todos los usuarios registrados (sin contraseñas).

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "created_at": "2025-11-01T..."
    }
  ]
}
```

#### **GET /api/health**
Verifica el estado del servidor.

### 🐳 Ejecutar con Docker

```bash
# Levantar todos los servicios
docker compose up

# En segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f server
docker-compose logs -f postgres
```

### 🧪 Probar las rutas

```bash
# Registrar usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Ver usuarios
curl http://localhost:3001/api/auth/users
```

### 🔒 Seguridad implementada

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Validación de formato de email
- ✅ Validación de longitud de contraseña (mínimo 6 caracteres)
- ✅ Manejo de errores centralizado
- ✅ Logger de peticiones HTTP
- ✅ Registro de IP y User Agent en sesiones
