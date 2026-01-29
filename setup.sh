#!/bin/bash

# Script de Setup e Inicializacao - SAEV Frontend
# Execute este script para configurar e iniciar o frontend automaticamente

set -e

echo "=========================================="
echo "   SAEV Frontend - Setup e Inicializacao"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Verificar Node.js
print_info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado. Instale Node.js 22.x LTS"
    exit 1
fi

NODE_VERSION=$(node -v)
NODE_MAJOR=$(node -v | cut -d'.' -f1 | sed 's/v//')

if [ "$NODE_MAJOR" -lt 22 ]; then
    print_error "Node.js $NODE_VERSION encontrado, mas é necessário Node.js 22 ou superior"
    echo "  Instale Node.js 22.x LTS: https://nodejs.org/"
    exit 1
fi

print_success "Node.js $NODE_VERSION encontrado"
echo ""

# Verificar Yarn
print_info "Verificando Yarn..."
if ! command -v yarn &> /dev/null; then
    print_info "Yarn não encontrado. Instalando..."
    npm install -g yarn
fi
print_success "Yarn $(yarn -v) encontrado"
echo ""

echo "=========================================="
echo "   Instalando Dependências"
echo "=========================================="
echo ""

yarn install
print_success "Dependências instaladas"
echo ""

echo "=========================================="
echo "   Configurando Tipos TypeScript"
echo "=========================================="
echo ""

print_info "Removendo versões incompatíveis dos tipos..."
yarn remove @types/react @types/react-dom @types/node 2>/dev/null || true

print_info "Instalando tipos compatíveis com React 17..."
yarn add --dev @types/react@17.0.38 @types/react-dom@17.0.11 @types/node@18.11.18
if [ $? -eq 0 ]; then
    print_success "Tipos do TypeScript instalados"
else
    print_warning "Falha ao instalar tipos, mas continuando..."
fi

# Limpar cache do Next.js para evitar problemas
print_info "Limpando cache do Next.js..."
rm -rf .next
print_success "Cache limpo"
echo ""

echo "=========================================="
echo "   Configurando Ambiente"
echo "=========================================="
echo ""

if [ -f .env.development ]; then
    print_success "Arquivo .env.development já existe"
else
    if [ -f .env.example ]; then
        print_info "Criando arquivo .env.development..."
        cp .env.example .env.development
        print_success "Arquivo .env.development criado"
    else
        print_error "Arquivo .env.example não encontrado"
        exit 1
    fi
fi
echo ""

echo "=========================================="
echo "   Iniciando Frontend"
echo "=========================================="
echo ""
print_info "O frontend será iniciado em modo desenvolvimento..."
print_info "Acesse em: http://localhost:3000"
echo ""
print_info "IMPORTANTE: Certifique-se de que o backend está rodando!"
echo "  Backend deve estar em: http://localhost:3003"
echo ""

# Iniciar o servidor
yarn dev
