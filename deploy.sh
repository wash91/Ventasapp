#!/bin/bash

# Script de deployment para Ventasapp
# Ejecutar con: bash deploy.sh

echo "🚀 Iniciando deployment de Ventasapp..."
echo ""

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI no está instalado"
    echo "Instálalo con: npm install -g firebase-tools"
    exit 1
fi

# Verificar autenticación
echo "🔐 Verificando autenticación..."
firebase use

if [ $? -ne 0 ]; then
    echo "❌ No estás autenticado en Firebase"
    echo "Ejecuta: firebase login"
    exit 1
fi

echo ""
echo "📦 Desplegando hosting y Firestore rules..."
firebase deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Deployment completado exitosamente!"
    echo ""
    echo "📋 Pasos siguientes:"
    echo "1. Abre tu app en el navegador"
    echo "2. Presiona Ctrl + Shift + R para forzar actualización"
    echo "3. Verifica la consola para confirmar versión: ventas-v5-manual-returns"
    echo "4. Prueba crear una venta con RECARGA y marcar el checkbox"
    echo "5. Verifica el módulo 'Bidones Prestados'"
else
    echo ""
    echo "❌ Error durante el deployment"
    echo "Revisa los errores arriba y vuelve a intentar"
    exit 1
fi
