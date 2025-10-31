# ========================================
# Etapa 1: Construir el cliente con Vite
# ========================================
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Copiar archivos de dependencias
COPY client/package*.json ./

# Instalar dependencias
RUN npm ci --silent

# Copiar código fuente
COPY client/ ./

# Construir la aplicación
RUN npm run build

# ========================================
# Etapa 2: Configurar el servidor
# ========================================
FROM node:20-alpine AS server-builder
WORKDIR /app/server

# Copiar archivos de dependencias del servidor
COPY server/package*.json ./

# Instalar dependencias
RUN npm ci --silent

# Copiar código fuente del servidor
COPY server/ ./

# Copiar build del cliente (dist de Vite) al servidor
COPY --from=client-builder /app/client/dist ./client_build

# ========================================
# Etapa final: Imagen de producción
# ========================================
FROM node:20-alpine
WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Instalar solo dependencias de producción
COPY server/package*.json ./server/
RUN cd server && npm ci --production --silent

# Copiar servidor y build del cliente
COPY --from=server-builder /app/server ./server

# Cambiar al directorio del servidor
WORKDIR /app/server

# Exponer puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/status', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Ejecutar servidor
CMD ["node", "index.js"]