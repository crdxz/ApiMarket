#!/usr/bin/env python3
"""
Script para insertar datos de prueba en la base de datos
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User, Category, Product
from werkzeug.security import generate_password_hash

def insert_test_data():
    """Insertar datos de prueba en la base de datos"""
    app = create_app()
    
    with app.app_context():
        print("🗄️  Insertando datos de prueba...")
        
        # Crear usuarios de prueba
        print("👥 Creando usuarios...")
        
        # Verificar si ya existen usuarios
        existing_users = User.query.all()
        if existing_users:
            print("⚠️  Ya existen usuarios en la base de datos")
            return
        
        # Usuario vendedor
        seller = User(
            name='Juan Vendedor',
            email='vendedor@test.com',
            password_hash=generate_password_hash('password123'),
            phone='+1234567890',
            address='Calle Principal 123, Ciudad',
            user_type='seller'
        )
        
        # Usuario comprador
        buyer = User(
            name='María Compradora',
            email='comprador@test.com',
            password_hash=generate_password_hash('password123'),
            phone='+0987654321',
            address='Avenida Comercial 456, Ciudad',
            user_type='buyer'
        )
        
        db.session.add(seller)
        db.session.add(buyer)
        db.session.commit()
        
        print(f"✅ Usuarios creados:")
        print(f"   - Vendedor: {seller.email} (ID: {seller.id})")
        print(f"   - Comprador: {buyer.email} (ID: {buyer.id})")
        
        # Crear categorías
        print("📂 Creando categorías...")
        
        categories = [
            Category(name='Electrónicos', description='Productos electrónicos y tecnología'),
            Category(name='Ropa', description='Ropa y accesorios'),
            Category(name='Hogar', description='Artículos para el hogar'),
            Category(name='Deportes', description='Equipos y ropa deportiva'),
            Category(name='Libros', description='Libros y material educativo')
        ]
        
        for category in categories:
            db.session.add(category)
        db.session.commit()
        
        print(f"✅ Categorías creadas: {len(categories)}")
        
        # Crear productos de prueba para el vendedor
        print("📦 Creando productos...")
        
        products = [
            Product(
                title='iPhone 12 Pro',
                description='iPhone 12 Pro en excelente estado, 128GB, color azul',
                price=799.99,
                stock=1,
                seller_id=seller.id,
                category_id=categories[0].id  # Electrónicos
            ),
            Product(
                title='Nike Air Max 270',
                description='Zapatillas Nike Air Max 270, talla 42, color negro',
                price=129.99,
                stock=2,
                seller_id=seller.id,
                category_id=categories[1].id  # Ropa
            ),
            Product(
                title='Sofá de 3 plazas',
                description='Sofá moderno de 3 plazas, color gris, perfecto estado',
                price=450.00,
                stock=1,
                seller_id=seller.id,
                category_id=categories[2].id  # Hogar
            ),
            Product(
                title='Pelota de Fútbol',
                description='Pelota oficial de fútbol, talla 5, marca Adidas',
                price=45.99,
                stock=3,
                seller_id=seller.id,
                category_id=categories[3].id  # Deportes
            ),
            Product(
                title='El Señor de los Anillos',
                description='Trilogía completa de El Señor de los Anillos, edición especial',
                price=35.50,
                stock=1,
                seller_id=seller.id,
                category_id=categories[4].id  # Libros
            )
        ]
        
        for product in products:
            db.session.add(product)
        db.session.commit()
        
        print(f"✅ Productos creados: {len(products)}")
        
        print("\n🎉 Datos de prueba insertados exitosamente!")
        print("\n📋 Credenciales de prueba:")
        print("   Vendedor: vendedor@test.com / password123")
        print("   Comprador: comprador@test.com / password123")
        print("\n🌐 Puedes probar la aplicación en:")
        print("   - Frontend: http://localhost:3000 (o el puerto que uses)")
        print("   - API: http://localhost:5000")

if __name__ == "__main__":
    insert_test_data() 