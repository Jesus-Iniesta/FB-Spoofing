#!/bin/bash

# Script de despliegue para FB-Spoofing en VPS
# Servidor: 77.37.63.94 (Hostinger)
# Dominio: spotify-mx.publicvm.com

set -e

echo "🚀 Iniciando despliegue de FB-Spoofing..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar que estamos en el servidor
echo -e "${YELLOW}📍 Verificando ubicación...${NC}"
if [ ! -f "/etc/hostname" ]; then
    echo -e "${RED}❌ Error: Este script debe ejecutarse en el servidor VPS${NC}"
    exit 1
fi

# 2. Actualizar sistema
echo -e "${YELLOW}📦 Actualizando sistema...${NC}"
sudo apt update && sudo apt upgrade -y

# 3. Instalar Docker si no está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Instalando Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo -e "${GREEN}✅ Docker ya está instalado${NC}"
fi

# 4. Instalar Docker Compose si no está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}🐳 Instalando Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo -e "${GREEN}✅ Docker Compose ya está instalado${NC}"
fi

# 5. Configurar firewall
echo -e "${YELLOW}🔥 Configurando firewall...${NC}"
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 8080/tcp   # HTTP (Puerto alternativo)
sudo ufw allow 8443/tcp   # HTTPS (Puerto alternativo)
sudo ufw --force enable

# 6. Crear directorio de la aplicación
echo -e "${YELLOW}📁 Creando directorios...${NC}"
sudo mkdir -p /var/www/fb-spoofing
sudo chown -R $USER:$USER /var/www/fb-spoofing

# 7. Verificar archivo .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: Falta el archivo .env.production${NC}"
    echo -e "${YELLOW}Por favor crea el archivo .env.production basado en .env.production.example${NC}"
    exit 1
fi

# 8. Crear directorios para certbot
echo -e "${YELLOW}🔐 Preparando directorios para SSL...${NC}"
mkdir -p certbot/conf
mkdir -p certbot/www

# 9. Detener contenedores anteriores si existen
echo -e "${YELLOW}🛑 Deteniendo contenedores anteriores...${NC}"
docker-compose -f docker-compose.prod.yml down || true

# 10. Construir y levantar contenedores
echo -e "${YELLOW}🏗️  Construyendo imágenes...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}🚀 Iniciando servicios...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# 11. Esperar a que los servicios estén listos
echo -e "${YELLOW}⏳ Esperando a que los servicios estén listos...${NC}"
sleep 10

# 12. Verificar estado de los contenedores
echo -e "${YELLOW}📊 Estado de los contenedores:${NC}"
docker-compose -f docker-compose.prod.yml ps

# 13. Mostrar logs
echo -e "${YELLOW}📋 Últimos logs:${NC}"
docker-compose -f docker-compose.prod.yml logs --tail=50

echo -e "${GREEN}✅ ¡Despliegue completado!${NC}"
echo -e "${YELLOW}🌐 Tu aplicación debería estar disponible en:${NC}"
echo -e "${GREEN}   http://spotify-mx.publicvm.com:8080${NC}"
echo -e "${GREEN}   http://77.37.63.94:8080${NC}"
echo -e ""
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo -e "   1. Configura el DNS del dominio apuntando a 77.37.63.94"
echo -e "   2. Configura un proxy reverso en tu servidor principal para redirigir"
echo -e "      desde puerto 80/443 al puerto 8080/8443"
echo -e "   3. O ejecuta: sudo ./setup-ssl.sh para configurar HTTPS en puerto 8443"
echo -e "   4. Verifica los logs con: docker-compose -f docker-compose.prod.yml logs -f"
