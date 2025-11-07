# FB-Spoofing

> **Aviso importante (uso educativo):** Este repositorio se proporciona únicamente con fines educativos y de demostración. Su objetivo es ejemplificar conceptos técnicos relacionados con "spoofing" para aprendizaje, pruebas controladas y actividades de investigación responsables. El autor y colaboradores no apoyan ni promueven el uso malintencionado de este material y no se responsabilizan por acciones ilegales, daños a terceros ni consecuencias derivadas del uso indebido del código. Si vas a usar o adaptar este proyecto, hazlo siempre de forma ética y conforme a la legislación aplicable.

Proyecto Full Stack con **Vite + React + Express.js** y **Docker**

## 🚀 Tecnologías

### Frontend
- ⚛️ React 18
- ⚡ Vite 5
- 🎨 CSS moderno

### Backend
- 🟢 Node.js 20
- 🚂 Express.js
- 🔒 CORS configurado

### DevOps
- 🐳 Docker & Docker Compose
- 📦 Multi-stage builds optimizados

## 📁 Estructura del Proyecto

```
FB-Spoofing/
├── client/                 # Aplicación React con Vite
│   ├── src/
│   │   ├── App.jsx        # Componente principal
│   │   ├── App.css
│   │   ├── main.jsx       # Entry point
│   │   └── index.css
│   ├── index.html         # HTML principal
│   ├── vite.config.js     # Configuración de Vite
│   ├── package.json
│   └── .env
├── server/                 # API Express
│   ├── index.js           # Servidor principal
│   ├── package.json
│   └── .env
├── docker-compose.yml      # Desarrollo local
├── Dockerfile             # Producción
└── README.md
```

## 🛠️ Instalación y Uso

### Opción 1: Desarrollo con Docker (Recomendado)

```powershell
# Iniciar servicios (cliente + servidor)
docker compose up

# Acceder a:
# - Cliente: http://localhost:3000
# - API: http://localhost:3001
```

### Opción 2: Desarrollo Local

#### Cliente (React + Vite)
```powershell
cd client
npm install
npm run dev
```

#### Servidor (Express)
```powershell
cd server
npm install
npm run dev
```

### Opción 3: Producción con Docker

```powershell
# Construir imagen de producción
docker build -t fb-spoofing:latest .

# Ejecutar contenedor
docker run -p 3000:3000 fb-spoofing:latest
```

## 🔧 Scripts Disponibles

### Cliente
- `npm run dev` - Servidor de desarrollo (puerto 3000)
- `npm run build` - Build de producción
- `npm run preview` - Vista previa del build

### Servidor
- `npm start` - Iniciar servidor (producción)
- `npm run dev` - Servidor con hot-reload

## 🌐 API Endpoints

```
GET /api/hello   - Mensaje de bienvenida
GET /api/status  - Estado del servidor
```

## 🐳 Docker

### Desarrollo
- Hot-reload activado para cliente y servidor
- Volumes para persistir cambios
- Network compartida entre servicios

### Producción
- Build multi-stage optimizado
- Imagen final ligera (~150MB)
- Healthcheck incluido
- Servir cliente estático desde Express

## 📝 Variables de Entorno

### Cliente (.env)
```env
VITE_API_URL=http://localhost:3001
```

### Servidor (.env)
```env
NODE_ENV=development
PORT=3001
```

## 🔥 Características

- ✅ Hot Module Replacement (HMR) con Vite
- ✅ Proxy API configurado en desarrollo
- ✅ CORS habilitado
- ✅ Healthcheck en producción
- ✅ Optimización de builds
- ✅ Docker multi-stage
- ✅ ES Modules en Node.js

## 📦 Próximos Pasos

- [ ] Agregar base de datos (PostgreSQL/MongoDB)
- [ ] Implementar autenticación JWT
- [ ] Agregar React Router
- [ ] Configurar testing (Vitest/Jest)
- [ ] CI/CD con GitHub Actions
- [ ] Deployment a la nube

## 👨‍💻 Desarrollo

Creado con ❤️ usando las mejores prácticas modernas de desarrollo web.

---

**¿Necesitas ayuda?** Abre un issue en el repositorio.
