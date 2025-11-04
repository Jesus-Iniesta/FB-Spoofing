#!/bin/bash

# Script para configurar SSL con Let's Encrypt
# Dominio: spotify-mx.publicvm.com

set -e

DOMAIN="spotify-mx.publicvm.com"
EMAIL="tu-email@ejemplo.com"  # CAMBIA ESTO POR TU EMAIL

echo "🔐 Configurando SSL para $DOMAIN..."

# Verificar que nginx esté corriendo
if ! docker ps | grep -q fb-spoofing-nginx; then
    echo "❌ Error: El contenedor de nginx no está corriendo"
    echo "   Ejecuta primero: docker-compose -f docker-compose.prod.yml up -d"
    exit 1
fi

# Crear configuración temporal de nginx sin SSL
echo "📝 Creando configuración temporal..."
cat > nginx/conf.d/app.conf.temp << 'EOF'
server {
    listen 80;
    server_name spotify-mx.publicvm.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://server:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Backup de la configuración actual
cp nginx/conf.d/app.conf nginx/conf.d/app.conf.backup

# Aplicar configuración temporal
cp nginx/conf.d/app.conf.temp nginx/conf.d/app.conf

# Recargar nginx
echo "🔄 Recargando nginx..."
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Obtener certificado SSL
echo "🎫 Solicitando certificado SSL..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Restaurar configuración con SSL
echo "✅ Restaurando configuración con SSL..."
cp nginx/conf.d/app.conf.backup nginx/conf.d/app.conf

# Recargar nginx con SSL
echo "🔄 Recargando nginx con SSL..."
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Limpiar archivos temporales
rm nginx/conf.d/app.conf.temp

echo "✅ ¡SSL configurado exitosamente!"
echo "🌐 Tu sitio ahora está disponible en: https://$DOMAIN"
