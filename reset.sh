#!/bin/bash

# Script de Reset - SAEV Frontend

echo "=========================================="
echo "   SAEV Frontend - Reset"
echo "=========================================="
echo ""
echo "⚠ Este script irá:"
echo "  - Remover node_modules"
echo "  - Remover arquivo .env.development"
echo "  - Remover yarn.lock"
echo "  - Remover .next"
echo ""
read -p "Deseja continuar? (s/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Ss]$ ]]; then
    echo "Cancelado."
    exit 0
fi

echo ""
echo "→ Removendo dependências..."
rm -rf node_modules yarn.lock .env.development .next 2>/dev/null || true
echo "✓ Limpeza concluída"

echo ""
echo "✓ Reset concluído!"
echo ""
echo "Para reinstalar: ./setup.sh"
echo ""
