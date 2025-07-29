#!/usr/bin/env python3
"""
Script para iniciar la API de Marketplace
"""

import os
import sys
from app import create_app

def main():
    """Función principal para iniciar la aplicación"""
    print("🚀 Iniciando API de Marketplace...")
    
    # Crear la aplicación
    app = create_app()
    
    # Configuración para desarrollo
    host = os.getenv('FLASK_HOST', 'localhost')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"📍 Servidor iniciado en: http://{host}:{port}")
    print(f"🔧 Modo debug: {debug}")
    print(f"🌐 CORS habilitado para desarrollo")
    print("\n📋 Endpoints disponibles:")
    print("   - POST /api/users/login")
    print("   - POST /api/users/register")
    print("   - GET  /api/users/health")
    print("   - GET  /api/users/test")
    print("\n⏹️  Presiona Ctrl+C para detener el servidor")
    
    try:
        app.run(host=host, port=port, debug=debug)
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido")
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 