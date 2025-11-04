# Guía de Despliegue - FB-Spoofing en VPS

## 📋 Información del Servidor

- **Proveedor:** Hostinger
- **IP:** 77.37.63.94
- **OS:** Ubuntu Server
- **Dominio:** spotify-mx.publicvm.com
- **Proveedor DNS:** freedomain.one
- **Puertos de la App:** 8080 (HTTP), 8443 (HTTPS)

> **Nota:** Los puertos 80 y 443 ya están ocupados por otros proyectos en el servidor.
> Se requiere configurar un proxy reverso (ver `PROXY-SETUP.md`)

---

## 🚀 Pasos de Despliegue

### 1. Configurar DNS

Ve a **freedomain.one** y configura los siguientes registros DNS:

```
Tipo: A
Nombre: @
Valor: 77.37.63.94
TTL: 3600

Tipo: A
Nombre: www
Valor: 77.37.63.94
TTL: 3600
```

⏰ **Importante:** Los cambios de DNS pueden tardar hasta 24 horas en propagarse.

---

### 2. Conectarse al Servidor VPS

Desde tu terminal local:

```bash
ssh root@77.37.63.94
# O si tienes un usuario específico:
ssh usuario@77.37.63.94
```

---

### 3. Preparar el Servidor

Una vez conectado al VPS, crea el archivo de variables de entorno:

```bash
# Crear .env.production
nano .env.production
```

Copia y pega este contenido (modifica las contraseñas):

```env
POSTGRES_DB=fb_spoofing
POSTGRES_USER=anonymous
POSTGRES_PASSWORD=TU_CONTRASEÑA_SEGURA_AQUI

NODE_ENV=production
PORT=3001
DB_HOST=postgres
DB_PORT=5432

DOMAIN=spotify-mx.publicvm.com
```

Guarda con `Ctrl + O`, Enter, y sal con `Ctrl + X`.

---

### 4. Subir el Proyecto al Servidor

Desde tu **máquina local**, sube el proyecto:

**Opción A: Con Git (Recomendado)**

```bash
# En tu máquina local
cd /home/jesus/Repos/FB-Spoofing
git add .
git commit -m "Preparar para producción"
git push origin main

# En el servidor VPS
cd /var/www
git clone https://github.com/Jesus-Iniesta/FB-Spoofing.git fb-spoofing
cd fb-spoofing
```

**Opción B: Con SCP**

```bash
# En tu máquina local
cd /home/jesus/Repos
scp -r FB-Spoofing root@77.37.63.94:/var/www/fb-spoofing
```

---

### 5. Ejecutar el Despliegue

En el servidor VPS:

```bash
cd /var/www/fb-spoofing

# Dar permisos de ejecución
chmod +x deploy.sh setup-ssl.sh

# Ejecutar despliegue
sudo ./deploy.sh
```

Este script:
- ✅ Actualiza el sistema
- ✅ Instala Docker y Docker Compose
- ✅ Configura el firewall
- ✅ Construye las imágenes Docker
- ✅ Inicia los contenedores

---

### 6. Verificar el Despliegue

```bash
# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.prod.yml logs -f server
docker-compose -f docker-compose.prod.yml logs -f client
docker-compose -f docker-compose.prod.yml logs -f nginx
```

En este punto, tu aplicación debería estar disponible en:
- **HTTP:** http://77.37.63.94:8080
- **Con Puerto:** http://spotify-mx.publicvm.com:8080

**⚠️ Importante:** Para acceder sin puerto, necesitas configurar un proxy reverso.
Ver la guía completa en `PROXY-SETUP.md`

---

### 7. Configurar Proxy Reverso (REQUERIDO)

Como los puertos 80 y 443 están ocupados, necesitas configurar el Nginx principal del servidor para redirigir tráfico a tu aplicación.

**Crea la configuración del proxy:**

```bash
sudo nano /etc/nginx/sites-available/spotify-mx.publicvm.com
```

**Agrega este contenido:**

```nginx
server {
    listen 80;
    server_name spotify-mx.publicvm.com;
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name spotify-mx.publicvm.com;

    # Estos certificados se obtendrán con certbot
    ssl_certificate /etc/letsencrypt/live/spotify-mx.publicvm.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/spotify-mx.publicvm.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Habilita el sitio:**

```bash
sudo ln -s /etc/nginx/sites-available/spotify-mx.publicvm.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Obtén el certificado SSL:**

```bash
sudo certbot --nginx -d spotify-mx.publicvm.com
```

Ahora tu sitio estará disponible en:
- **HTTPS:** https://spotify-mx.publicvm.com (sin puerto)
- **HTTP:** http://spotify-mx.publicvm.com (redirige a HTTPS)

Para más opciones de configuración, consulta `PROXY-SETUP.md`

---

### 8. Configurar HTTPS con SSL (Opcional - Solo si NO usas proxy)

**Antes de ejecutar este paso:**
1. Asegúrate de que el DNS esté propagado (verifica en https://dnschecker.org)
2. Edita `setup-ssl.sh` y cambia el email

```bash
# Editar el script
nano setup-ssl.sh
# Cambia: EMAIL="tu-email@ejemplo.com" por tu email real

# Ejecutar configuración de SSL
sudo ./setup-ssl.sh
```

Ahora tu sitio estará disponible con HTTPS:
- **HTTPS:** https://spotify-mx.publicvm.com

---

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Detener todos los servicios
docker-compose -f docker-compose.prod.yml down

# Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d

# Reiniciar un servicio específico
docker-compose -f docker-compose.prod.yml restart server

# Reconstruir imágenes
docker-compose -f docker-compose.prod.yml build --no-cache

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Base de Datos

```bash
# Conectarse a PostgreSQL
docker exec -it fb-spoofing-db psql -U anonymous -d fb_spoofing

# Backup de la base de datos
docker exec fb-spoofing-db pg_dump -U anonymous fb_spoofing > backup.sql

# Restaurar backup
cat backup.sql | docker exec -i fb-spoofing-db psql -U anonymous -d fb_spoofing
```

### Nginx

```bash
# Recargar configuración de nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Verificar configuración
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Actualizaciones

```bash
cd /var/www/fb-spoofing

# Si usas Git
git pull origin main

# Reconstruir y reiniciar
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔒 Seguridad

### Cambiar Contraseñas

Después del primer despliegue, cambia todas las contraseñas:

```bash
# Editar .env.production
nano .env.production

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

### Firewall

El firewall UFW está configurado para permitir solo:
- Puerto 22 (SSH)
- Puerto 80 (HTTP)
- Puerto 443 (HTTPS)

```bash
# Ver estado del firewall
sudo ufw status

# Permitir un puerto adicional (ejemplo)
sudo ufw allow 8080/tcp
```

---

## 📊 Monitoreo

### Ver uso de recursos

```bash
# CPU y memoria de contenedores
docker stats

# Espacio en disco
df -h

# Logs del sistema
sudo journalctl -xe
```

---

## 🐛 Solución de Problemas

### El sitio no carga

```bash
# 1. Verificar que nginx está corriendo
docker ps | grep nginx

# 2. Ver logs de nginx
docker-compose -f docker-compose.prod.yml logs nginx

# 3. Verificar configuración de nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Error de conexión a la base de datos

```bash
# 1. Verificar que postgres está corriendo
docker ps | grep postgres

# 2. Ver logs de postgres
docker-compose -f docker-compose.prod.yml logs postgres

# 3. Verificar variables de entorno
docker-compose -f docker-compose.prod.yml exec server env | grep DB_
```

### SSL no funciona

```bash
# 1. Verificar certificados
sudo ls -la certbot/conf/live/spotify-mx.publicvm.com/

# 2. Renovar certificado manualmente
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# 3. Recargar nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## 📞 Contacto y Soporte

Si encuentras problemas, verifica:
1. Los logs de Docker Compose
2. El estado de los contenedores
3. La configuración de DNS
4. El firewall del VPS

---

**¡Listo!** 🎉 Tu aplicación FB-Spoofing está ahora en producción.
