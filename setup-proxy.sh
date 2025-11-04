#!/bin/bash

# Script para configurar Nginx como proxy reverso para FB-Spoofing
# Este script debe ejecutarse en el servidor VPS con permisos de root

set -e

DOMAIN="spotify-mx.publicvm.com"
APP_PORT="8080"
EMAIL="tu-email@ejemplo.com"  # CAMBIA ESTO

echo "🔧 Configurando Nginx como Proxy Reverso..."

# Verificar que nginx está instalado
if ! command -v nginx &> /dev/null; then
    echo "❌ Error: Nginx no está instalado"
    echo "   Instala nginx con: sudo apt install nginx"
    exit 1
fi

# Verificar que certbot está instalado
if ! command -v certbot &> /dev/null; then
    echo "⚠️  Certbot no está instalado. Instalando..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Crear configuración de nginx
echo "📝 Creando configuración de nginx..."
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
# HTTP - Temporal para obtener certificado SSL
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Crear enlace simbólico
if [ ! -L "/etc/nginx/sites-enabled/$DOMAIN" ]; then
    echo "🔗 Habilitando sitio..."
    sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
fi

# Verificar configuración
echo "✅ Verificando configuración de nginx..."
sudo nginx -t

# Recargar nginx
echo "🔄 Recargando nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Configuración básica completada!"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Verifica que tu app responde en el puerto $APP_PORT:"
echo "   curl http://localhost:$APP_PORT"
echo ""
echo "2. Verifica el proxy:"
echo "   curl http://$DOMAIN"
echo ""
echo "3. Configura SSL con certbot:"
echo "   sudo certbot --nginx -d $DOMAIN --email $EMAIL"
echo ""
echo "4. Después de obtener SSL, nginx redirigirá automáticamente HTTP a HTTPS"
echo ""
echo "🌐 Tu sitio estará disponible en:"
echo "   https://$DOMAIN"
