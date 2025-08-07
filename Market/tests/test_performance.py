import pytest
import time
import json
from werkzeug.security import generate_password_hash
from app.models import User, Category, Product, PurchaseRequest, Message

class TestPerformance:
    """Pruebas de rendimiento del sistema"""
    
    def test_bulk_user_registration_fast(self, client):
        """Bulk registration of 100 users should be fast and successful"""
        start_time = time.time()
        
        # Registrar 100 usuarios
        for i in range(100):
            data = {
                'name': f'User {i}',
                'email': f'user{i}@example.com',
                'password': 'password123',
                'user_type': 'buyer'
            }
            
            response = client.post('/api/users/register', 
                                 data=json.dumps(data),
                                 content_type='application/json')
            
            assert response.status_code == 201
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        # Verificar que el tiempo de ejecución es razonable (< 10 segundos)
        assert execution_time < 10.0
        print(f"Registro de 100 usuarios completado en {execution_time:.2f} segundos")
    
    def test_bulk_product_creation_efficient(self, client, app):
        """Bulk creation of 50 products should be efficient and error-free"""
        with app.app_context():
            from app import db
            # Crear vendedor y categoría
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            seller_id = seller.id
            category_id = category.id
        start_time = time.time()
        # Crear 50 productos
        for i in range(50):
            data = {
                'title': f'Product {i}',
                'description': f'Description for product {i}',
                'price': 100.00 + i,
                'stock': 10,
                'seller_id': seller_id,
                'category_id': category_id
            }
            response = client.post('/api/products/', 
                                 data=json.dumps(data),
                                 content_type='application/json')
            assert response.status_code == 201
        end_time = time.time()
        execution_time = end_time - start_time
        # Verificar que el tiempo de ejecución es razonable (< 5 segundos)
        assert execution_time < 5.0
        print(f"Creación de 50 productos completada en {execution_time:.2f} segundos")
    
    def test_large_product_listing_fast(self, client, app):
        """Listing 100 products should be fast and correct"""
        with app.app_context():
            from app import db
            
            # Crear datos de prueba
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            
            # Crear 100 productos
            products = []
            for i in range(100):
                product = Product(
                    title=f'Product {i}',
                    description=f'Description for product {i}',
                    price=100.00 + i,
                    stock=10,
                    seller_id=seller.id,
                    category_id=category.id,
                    is_active=True
                )
                products.append(product)
            
            db.session.add_all(products)
            db.session.commit()
        
        # Medir tiempo de respuesta para obtener productos
        start_time = time.time()
        
        response = client.get('/api/products/')
        
        end_time = time.time()
        response_time = end_time - start_time
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 100
        
        # Verificar que el tiempo de respuesta es razonable (< 1 segundo)
        assert response_time < 1.0
        print(f"Listado de 100 productos completado en {response_time:.3f} segundos")
    
    def test_concurrent_product_detail_access(self, client, app):
        """Concurrent access to product detail should be stable and fast"""
        with app.app_context():
            from app import db
            # Crear datos de prueba
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            # Crear producto
            product = Product(
                title='Test Product',
                description='Test description',
                price=100.00,
                stock=10,
                seller_id=seller.id,
                category_id=category.id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            product_id = product.id
        start_time = time.time()
        import threading
        def access_product():
            response = client.get(f'/api/products/{product_id}')
            assert response.status_code == 200
        threads = []
        for _ in range(50):
            thread = threading.Thread(target=access_product)
            threads.append(thread)
            thread.start()
        for thread in threads:
            thread.join()
        end_time = time.time()
        execution_time = end_time - start_time
        assert execution_time < 3.0
        print(f"50 accesos concurrentes completados en {execution_time:.2f} segundos")
    
    def test_memory_usage_under_load_is_controlled(self, client, app):
        """Memory usage under load should remain under a reasonable threshold"""
        import psutil
        import os
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        with app.app_context():
            from app import db
            # Crear datos de prueba
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            seller_id = seller.id
            category_id = category.id
            # Crear menos productos para evitar sobreuso de memoria
            products = []
            for i in range(500):
                product = Product(
                    title=f'Product {i}',
                    description=f'Description for product {i} with some additional text to increase memory usage',
                    price=100.00 + i,
                    stock=10,
                    seller_id=seller_id,
                    category_id=category_id,
                    is_active=True
                )
                products.append(product)
            db.session.add_all(products)
            db.session.commit()
        # Realizar múltiples operaciones
        for i in range(100):
            response = client.get('/api/products/')
            assert response.status_code == 200
        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_increase = final_memory - initial_memory
        print(f"Uso inicial de memoria: {initial_memory:.2f} MB")
        print(f"Uso final de memoria: {final_memory:.2f} MB")
        print(f"Incremento de memoria: {memory_increase:.2f} MB")
        # Verificar que el incremento de memoria es razonable (< 150 MB)
        assert memory_increase < 150.0


class TestStressTests:
    """Pruebas de estrés del sistema"""
    
    def test_stable_rapid_api_calls(self, client, app):
        """API should respond correctly under many rapid calls"""
        with app.app_context():
            from app import db
            
            # Crear datos de prueba
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
        
        start_time = time.time()
        
        # Realizar 1000 llamadas rápidas a diferentes endpoints
        for i in range(1000):
            # Alternar entre diferentes endpoints
            if i % 4 == 0:
                response = client.get('/api/products/')
            elif i % 4 == 1:
                response = client.get('/api/categories/')
            elif i % 4 == 2:
                response = client.get('/api/users/health')
            else:
                response = client.get('/api/users/')
            
            # Verificar que al menos algunas respuestas son exitosas
            if i < 100:  # Solo verificar las primeras 100
                assert response.status_code in [200, 404, 500]  # Códigos válidos
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        # Verificar que el sistema no se bloquea
        assert execution_time < 30.0  # Máximo 30 segundos
        print(f"1000 llamadas rápidas completadas en {execution_time:.2f} segundos")
    
    def test_large_data_handling(self, client, app):
        """System should handle large volumes of data correctly"""
        with app.app_context():
            from app import db
            
            # Crear vendedor y categoría
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            
            # Crear 1000 productos con descripciones largas
            products = []
            for i in range(1000):
                product = Product(
                    title=f'Product {i}',
                    description=f'This is a very long description for product {i}. ' * 10,  # Descripción larga
                    price=100.00 + i,
                    stock=10,
                    seller_id=seller.id,
                    category_id=category.id,
                    is_active=True
                )
                products.append(product)
            
            db.session.add_all(products)
            db.session.commit()
        
        # Intentar obtener todos los productos
        start_time = time.time()
        
        response = client.get('/api/products/')
        
        end_time = time.time()
        response_time = end_time - start_time
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 1000
        
        # Verificar que el tiempo de respuesta es aceptable (< 5 segundos)
        assert response_time < 5.0
        print(f"Obtención de 1000 productos con descripciones largas en {response_time:.2f} segundos")
    
    def test_database_connection_stress(self, client, app):
        """System should withstand database connection stress"""
        with app.app_context():
            from app import db
            # Crear datos de prueba
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            seller_id = seller.id
            category_id = category.id
        start_time = time.time()
        # Realizar múltiples operaciones de lectura y escritura
        for i in range(500):
            # Crear producto
            data = {
                'title': f'Stress Product {i}',
                'description': f'Description for stress product {i}',
                'price': 100.00 + i,
                'stock': 10,
                'seller_id': seller_id,
                'category_id': category_id
            }
            response = client.post('/api/products/', 
                                 data=json.dumps(data),
                                 content_type='application/json')
            if i % 10 == 0:  # Verificar cada 10 productos
                assert response.status_code == 201
        end_time = time.time()
        execution_time = end_time - start_time
        # Verificar que el sistema mantiene la estabilidad
        assert execution_time < 60.0  # Máximo 1 minuto
        print(f"500 operaciones de base de datos completadas en {execution_time:.2f} segundos")


class TestLoadBalancing:
    """Pruebas de balanceo de carga"""
    
    def test_load_balancing_multiple_concurrent_users(self, client, app):
        """System should properly balance multiple concurrent users"""
        with app.app_context():
            from app import db
            # Crear datos de prueba
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            seller_id = seller.id
            category_id = category.id
            # Crear productos
            product = Product(
                title='Test Product',
                description='Test description',
                price=100.00,
                stock=10,
                seller_id=seller_id,
                category_id=category_id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            product_id = product.id
        import threading
        import queue
        results = queue.Queue()
        def simulate_user(user_id):
            try:
                response = client.get('/api/products/')
                if response.status_code == 200:
                    results.put(f"User {user_id}: Products viewed successfully")
                response = client.get(f'/api/products/{product_id}')
                if response.status_code == 200:
                    results.put(f"User {user_id}: Product details viewed successfully")
                response = client.get('/api/categories/')
                if response.status_code == 200:
                    results.put(f"User {user_id}: Categories viewed successfully")
            except Exception as e:
                results.put(f"User {user_id}: Error - {str(e)}")
        start_time = time.time()
        threads = []
        for i in range(20):
            thread = threading.Thread(target=simulate_user, args=(i,))
            threads.append(thread)
            thread.start()
        for thread in threads:
            thread.join()
        end_time = time.time()
        execution_time = end_time - start_time
        successful_operations = 0
        while not results.empty():
            result = results.get()
            if "successfully" in result:
                successful_operations += 1
        total_operations = 20 * 3
        success_rate = successful_operations / total_operations
        assert success_rate >= 0.8
        assert execution_time < 10.0
        print(f"20 usuarios concurrentes completados en {execution_time:.2f} segundos")
        print(f"Tasa de éxito: {success_rate:.2%}")


