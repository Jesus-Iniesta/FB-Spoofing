# Configuración de Proxy Reverso para FB-Spoofing

Tu servidor ya tiene otros proyectos usando los puertos 80 y 443, por lo que FB-Spoofing está configurado para usar:
- **Puerto HTTP:** 8080
- **Puerto HTTPS:** 8443

## Opción 1: Usar el Proxy Reverso del Servidor Principal

Si ya tienes **Nginx** o **Apache** corriendo en el puerto 80/443, agrega esta configuración:

### Para Nginx (Recomendado)

Crea un nuevo archivo de configuración:

```bash
sudo nano /etc/nginx/sites-available/spotify-mx.publicvm.com
```

Agrega este contenido:

```nginx
# HTTP - Redirigir a HTTPS
server {
    listen 80;
    server_name spotify-mx.publicvm.com;
    
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS - Proxy a la aplicación
server {
    listen 443 ssl http2;
    server_name spotify-mx.publicvm.com;

    # Certificados SSL (obtener con certbot)
    ssl_certificate /etc/letsencrypt/live/spotify-mx.publicvm.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/spotify-mx.publicvm.com/privkey.pem;

    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Proxy a FB-Spoofing (puerto 8080 interno)
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Habilita el sitio y recarga nginx:

```bash
sudo ln -s /etc/nginx/sites-available/spotify-mx.publicvm.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Obtén el certificado SSL:

```bash
sudo certbot --nginx -d spotify-mx.publicvm.com
```

### Para Apache

Si usas Apache, crea:

```bash
sudo nano /etc/apache2/sites-available/spotify-mx.publicvm.com.conf
```

```apache
<VirtualHost *:80>
    ServerName spotify-mx.publicvm.com
    
    # Redirigir a HTTPS
    Redirect permanent / https://spotify-mx.publicvm.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName spotify-mx.publicvm.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/spotify-mx.publicvm.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/spotify-mx.publicvm.com/privkey.pem
    
    # Proxy a FB-Spoofing
    ProxyPreserveHost On
    ProxyPass / http://localhost:8080/
    ProxyPassReverse / http://localhost:8080/
    
    # Headers
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
</VirtualHost>
```

Habilita módulos y sitio:

```bash
sudo a2enmod proxy proxy_http ssl headers
sudo a2ensite spotify-mx.publicvm.com
sudo systemctl reload apache2
```

---

## Opción 2: Usar un Subdominio con Puerto Diferente

Si prefieres que los usuarios accedan directamente al puerto 8080:

1. **Configura DNS:**
   ```
   Tipo: A
   Nombre: spotify-mx
   Valor: 77.37.63.94
   ```

2. **Acceso directo:**
   - http://spotify-mx.publicvm.com:8080
   - https://spotify-mx.publicvm.com:8443 (después de configurar SSL)

3. **Nota:** Los usuarios deberán incluir el puerto en la URL.

---

## Opción 3: Usar Traefik como Proxy Reverso Global

Si tienes múltiples aplicaciones, Traefik puede gestionarlas automáticamente.

### Instalar Traefik

```bash
cd /var/www
mkdir traefik
cd traefik
```

Crea `docker-compose.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./acme.json:/acme.json
      - ./config:/config:ro
    networks:
      - proxy

networks:
  proxy:
    name: proxy
    driver: bridge
```

Crea `traefik.yml`:

```yaml
api:
  dashboard: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: proxy

certificatesResolvers:
  letsencrypt:
    acme:
      email: tu-email@ejemplo.com
      storage: acme.json
      httpChallenge:
        entryPoint: web
```

Prepara archivos:

```bash
touch acme.json
chmod 600 acme.json
```

Inicia Traefik:

```bash
docker-compose up -d
```

### Configurar FB-Spoofing con Traefik

Modifica el `docker-compose.prod.yml` de FB-Spoofing:

```yaml
services:
  nginx:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.fb-spoofing.rule=Host(`spotify-mx.publicvm.com`)"
      - "traefik.http.routers.fb-spoofing.entrypoints=websecure"
      - "traefik.http.routers.fb-spoofing.tls.certresolver=letsencrypt"
      - "traefik.http.services.fb-spoofing.loadbalancer.server.port=80"
    networks:
      - app-network
      - proxy

networks:
  app-network:
    driver: bridge
  proxy:
    external: true
```

Reinicia:

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

## Verificación

Después de configurar el proxy reverso:

```bash
# Verificar que tu app responde en 8080
curl http://localhost:8080

# Verificar el proxy desde fuera
curl http://spotify-mx.publicvm.com
curl https://spotify-mx.publicvm.com
```

---

## Recomendación

**Para tu caso:** Usa la **Opción 1 (Nginx como Proxy Reverso)** porque:
- ✅ Ya tienes Nginx corriendo
- ✅ Es la solución más simple
- ✅ Permite usar URLs limpias sin puertos
- ✅ Gestiona SSL fácilmente con certbot

El flujo será:
```
Usuario → nginx:443 (servidor principal) → localhost:8080 (FB-Spoofing)
```
