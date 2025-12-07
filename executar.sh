#!/bin/bash

# Script para iniciar servidor Vite com verificações

echo "🚀 Iniciando TEMPO-CLARO..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Instalando dependências npm...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Dependências npm instaladas${NC}"
    else
        echo -e "${RED}✗ Erro ao instalar dependências npm${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Dependências npm já instaladas${NC}"
fi

# Iniciar servidor Vite
echo -e "${GREEN}🌐 Iniciando servidor Vite...${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
npx vite
