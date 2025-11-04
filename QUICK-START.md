# 🚀 Guía Rápida de Despliegue

## Configuración Actual
- **Servidor:** 77.37.63.94 (Hostinger VPS)
- **Dominio:** spotify-mx.publicvm.com
- **Puertos App:** 8080 (HTTP), 8443 (HTTPS)
- **Nota:** Puertos 80 y 443 ocupados - requiere proxy reverso

---

## Pasos Rápidos

### 1️⃣ En tu Máquina Local

```bash
cd /home/jesus/Repos/FB-Spoofing

# Crear archivo .env.production
cp .env.production.example .env.production
nano .env.production
# Edita las contraseñas

# Subir a GitHub (si usas Git)
git add .
git commit -m "Preparar para producción"
git push origin main
```

### 2️⃣ Conectar al Servidor VPS

```bash
ssh root@77.37.63.94
# o
ssh tu-usuario@77.37.63.94
```

### 3️⃣ En el Servidor VPS

```bash
# Clonar proyecto
cd /var/www
git clone https://github.com/Jesus-Iniesta/FB-Spoofing.git fb-spoofing
cd fb-spoofing

# Copiar variables de entorno
cp .env.production.example .env.production
nano .env.production
# Edita y guarda

# Dar permisos a scripts
chmod +x deploy.sh setup-proxy.sh

# Ejecutar despliegue
sudo ./deploy.sh
```

**Espera 2-3 minutos...**

### 4️⃣ Configurar Proxy Reverso

```bash
# Editar el script (cambiar EMAIL)
nano setup-proxy.sh

# Ejecutar configuración de proxy
sudo ./setup-proxy.sh

# Configurar SSL
sudo certbot --nginx -d spotify-mx.publicvm.com
```

### 5️⃣ Verificar

```bash
# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Probar app
curl http://localhost:8080
curl https://spotify-mx.publicvm.com
```

---

## URLs Finales

✅ **Con Proxy Reverso (Recomendado):**
- https://spotify-mx.publicvm.com

✅ **Acceso Directo:**
- http://77.37.63.94:8080
- http://spotify-mx.publicvm.com:8080

---

## Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Detener todo
docker-compose -f docker-compose.prod.yml down

# Actualizar código (si usas Git)
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Backup base de datos
docker exec fb-spoofing-db pg_dump -U anonymous fb_spoofing > backup_$(date +%Y%m%d).sql

# Ver uso de recursos
docker stats
```

---

## Solución Rápida de Problemas

**App no carga:**
```bash
docker-compose -f docker-compose.prod.yml logs nginx
docker-compose -f docker-compose.prod.yml logs server
```

**Error de proxy:**
```bash
sudo nginx -t
sudo systemctl status nginx
sudo journalctl -u nginx -n 50
```

**Error de base de datos:**
```bash
docker-compose -f docker-compose.prod.yml logs postgres
docker exec -it fb-spoofing-db psql -U anonymous -d fb_spoofing
```

---

## Documentación Completa

- **Despliegue completo:** `DEPLOYMENT.md`
- **Configuración de Proxy:** `PROXY-SETUP.md`
- **README del proyecto:** `README.md`

---

**¿Problemas?** Revisa los logs y la documentación completa.
