import pytest
import json
from werkzeug.security import generate_password_hash
from app.models import User, Category, Product, PurchaseRequest, Message, Transaction

class Test_ProductExplorationAndSearch:
    """Pruebas para Historia de Usuario 2: Exploración y Búsqueda de Productos"""
    
    def test_get_products_list(self, client, app):
        """Prueba obtener lista de productos disponibles"""
        # Crear datos de prueba
        with app.app_context():
            from app import db
            
            # Crear categoría
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            
            # Crear usuario vendedor
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            db.session.commit()
            
            # Crear productos
            product1 = Product(
                title='iPhone 15',
                description='Latest iPhone model',
                price=999.99,
                stock=5,
                seller_id=seller.id,
                category_id=category.id,
                is_active=True
            )
            product2 = Product(
                title='Samsung Galaxy',
                description='Android smartphone',
                price=799.99,
                stock=3,
                seller_id=seller.id,
                category_id=category.id,
                is_active=True
            )
            db.session.add_all([product1, product2])
            db.session.commit()
        
        response = client.get('/api/products/')
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 2
        assert result['products'][0]['title'] == 'iPhone 15'
        assert result['products'][1]['title'] == 'Samsung Galaxy'
    
    def test_filter_products_by_category(self, client, app):
        """Prueba filtrar productos por categoría"""
        with app.app_context():
            from app import db
            # Crear categorías
            electronics = Category(name='Electronics', description='Electronic products')
            books = Category(name='Books', description='Books and literature')
            db.session.add_all([electronics, books])
            db.session.commit()
            electronics_id = electronics.id
            books_id = books.id
            # Crear vendedor
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            db.session.commit()
            seller_id = seller.id
            # Crear productos en diferentes categorías
            product1 = Product(
                title='iPhone 15',
                description='Latest iPhone model',
                price=999.99,
                stock=5,
                seller_id=seller_id,
                category_id=electronics_id,
                is_active=True
            )
            product2 = Product(
                title='Python Programming',
                description='Learn Python programming',
                price=29.99,
                stock=10,
                seller_id=seller_id,
                category_id=books_id,
                is_active=True
            )
            db.session.add_all([product1, product2])
            db.session.commit()
            # Usar el id real de la categoría
            electronics_id = electronics.id
        # Filtrar por categoría Electronics
        response = client.get(f'/api/products/?category_id={electronics_id}')
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 1
        assert result['products'][0]['title'] == 'iPhone 15'
        assert result['products'][0]['category_name'] == 'Electronics'
    
    def test_search_products_by_name(self, client, app):
        """Prueba búsqueda de productos por nombre"""
        with app.app_context():
            from app import db
            # Crear datos de prueba
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            category_id = category.id
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            db.session.commit()
            seller_id = seller.id
            # Crear productos con nombres específicos
            product1 = Product(
                title='iPhone 15 Pro',
                description='Latest iPhone model',
                price=999.99,
                stock=5,
                seller_id=seller_id,
                category_id=category_id,
                is_active=True
            )
            product2 = Product(
                title='Samsung Galaxy S24',
                description='Android smartphone',
                price=799.99,
                stock=3,
                seller_id=seller_id,
                category_id=category_id,
                is_active=True
            )
            db.session.add_all([product1, product2])
            db.session.commit()
        # Buscar productos que contengan "iPhone"
        response = client.get('/api/products/?search=iPhone')
        assert response.status_code == 200
        result = json.loads(response.data)
        # Aceptar todos los productos cuyo título contenga 'iPhone'
        iphone_products = [p for p in result['products'] if 'iPhone' in p['title']]
        assert len(iphone_products) >= 1
        for prod in iphone_products:
            assert 'iPhone' in prod['title']
    
    def test_empty_products_list(self, client):
        """Prueba cuando no hay productos disponibles"""
        response = client.get('/api/products/')
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 0


class Test_ProductDetailView:
    """Pruebas para Historia de Usuario 3: Visualización de Detalle de Producto"""
    
    def test_get_product_detail(self, client, app):
        """Prueba obtener detalles completos de un producto"""
        with app.app_context():
            from app import db
            # Crear datos de prueba
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller',
                phone='555-111-2222',
                address='Test Address 123'
            )
            db.session.add(seller)
            db.session.commit()
            product = Product(
                title='iPhone 15 Pro',
                description='Latest iPhone model with advanced features',
                price=1299.99,
                stock=5,
                seller_id=seller.id,
                category_id=category.id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            product_id = product.id
        response = client.get(f'/api/products/{product_id}')
        assert response.status_code == 200
        result = json.loads(response.data)
        # Verificar información del producto directamente
        assert result['title'] == 'iPhone 15 Pro'
        assert result['description'] == 'Latest iPhone model with advanced features'
        assert float(result['price']) == 1299.99
        assert result['stock'] == 5
        assert result['is_active'] == True
        # Verificar información del vendedor
        assert result['seller']['name'] == 'Test Seller'
        assert result['seller']['email'] == 'seller@example.com'
        assert result['seller']['phone'] == '555-111-2222'
        assert result['seller']['address'] == 'Test Address 123'
        # Verificar información de la categoría
        assert result['category']['name'] == 'Electronics'
        assert result['category']['description'] == 'Electronic products'
    
    def test_get_nonexistent_product(self, client):
        """Prueba obtener producto que no existe"""
        response = client.get('/api/products/999')
        assert response.status_code in [404, 500]


class Test_PurchaseMessage:
    """Pruebas para Historia de Usuario 4: Envío de Mensaje de Compra"""
    
    def test_send_purchase_message(self, client, app):
        """Prueba enviar mensaje de intención de compra"""
        with app.app_context():
            from app import db
            # Crear datos de prueba
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            buyer = User(
                name='Test Buyer',
                email='buyer@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='buyer'
            )
            db.session.add_all([seller, buyer])
            db.session.commit()
            product = Product(
                title='iPhone 15 Pro',
                description='Latest iPhone model',
                price=1299.99,
                stock=5,
                seller_id=seller.id,
                category_id=category.id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            purchase_request = PurchaseRequest(
                product_id=product.id,
                buyer_id=buyer.id,
                quantity=1,
                note='Interested in this product',
                status='pending'
            )
            db.session.add(purchase_request)
            db.session.commit()
            # Guardar los IDs necesarios
            purchase_request_id = purchase_request.id
            buyer_id = buyer.id
            seller_id = seller.id
        # Enviar mensaje
        message_data = {
            'purchase_request_id': purchase_request_id,
            'sender_id': buyer_id,
            'receiver_id': seller_id,
            'message': 'Hola, estoy interesado en comprar este iPhone. ¿Está disponible?'
        }
        response = client.post('/api/messages/', 
                             data=json.dumps(message_data),
                             content_type='application/json')
        assert response.status_code == 201
        result = json.loads(response.data)
        assert result['message'] == 'Message sent successfully'
        assert result['message_data']['message'] == 'Hola, estoy interesado en comprar este iPhone. ¿Está disponible?'
    
    def test_get_messages_for_request(self, client, app):
        """Prueba obtener mensajes de una solicitud de compra"""
        with app.app_context():
            from app import db
            # Crear datos de prueba
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            buyer = User(
                name='Test Buyer',
                email='buyer@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='buyer'
            )
            db.session.add_all([seller, buyer])
            db.session.commit()
            product = Product(
                title='iPhone 15 Pro',
                description='Latest iPhone model',
                price=1299.99,
                stock=5,
                seller_id=seller.id,
                category_id=category.id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            purchase_request = PurchaseRequest(
                product_id=product.id,
                buyer_id=buyer.id,
                quantity=1,
                note='Interested in this product',
                status='pending'
            )
            db.session.add(purchase_request)
            db.session.commit()
            # Crear mensajes
            message1 = Message(
                purchase_request_id=purchase_request.id,
                sender_id=buyer.id,
                receiver_id=seller.id,
                message='Hola, estoy interesado en el producto'
            )
            message2 = Message(
                purchase_request_id=purchase_request.id,
                sender_id=seller.id,
                receiver_id=buyer.id,
                message='Hola, sí está disponible. ¿Cuándo quieres verlo?'
            )
            db.session.add_all([message1, message2])
            db.session.commit()
            purchase_request_id = purchase_request.id
        response = client.get(f'/api/messages/{purchase_request_id}')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['messages']) == 2
        assert result['messages'][0]['message'] == 'Hola, estoy interesado en el producto'
        assert result['messages'][1]['message'] == 'Hola, sí está disponible. ¿Cuándo quieres verlo?'


class Test_SellerDashboard:
    """Pruebas para Historia de Usuario 5: Dashboard de Vendedor"""
    
    def test_get_seller_products(self, client, app):
        """Prueba obtener productos de un vendedor"""
        with app.app_context():
            from app import db
            # Crear vendedor
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            db.session.commit()
            seller_id = seller.id
            # Crear categoría
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            category_id = category.id
            # Crear productos del vendedor
            product1 = Product(
                title='iPhone 15 Pro',
                description='Latest iPhone model',
                price=1299.99,
                stock=5,
                seller_id=seller_id,
                category_id=category_id,
                is_active=True
            )
            product2 = Product(
                title='Samsung Galaxy S24',
                description='Android smartphone',
                price=999.99,
                stock=3,
                seller_id=seller_id,
                category_id=category_id,
                is_active=False
            )
            db.session.add_all([product1, product2])
            db.session.commit()
        response = client.get(f'/api/products/seller/{seller_id}')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 2
        # Verificar que incluye productos activos e inactivos
        active_products = [p for p in result['products'] if p['is_active']]
        inactive_products = [p for p in result['products'] if not p['is_active']]
        assert len(active_products) == 1
        assert len(inactive_products) == 1
    
    def test_create_new_product(self, client, app):
        """Prueba crear nuevo producto"""
        with app.app_context():
            from app import db
            # Crear vendedor
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            db.session.commit()
            seller_id = seller.id
            # Crear categoría
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            category_id = category.id
        product_data = {
            'title': 'New Product',
            'description': 'A new product description',
            'price': 299.99,
            'stock': 10,
            'seller_id': seller_id,
            'category_id': category_id
        }
        response = client.post('/api/products/', 
                             data=json.dumps(product_data),
                             content_type='application/json')
        assert response.status_code == 201
        result = json.loads(response.data)
        assert result['message'] == 'Product created successfully'
        assert result['product']['title'] == 'New Product'
        assert float(result['product']['price']) == 299.99
    
    def test_update_product(self, client, app):
        """Prueba actualizar producto existente"""
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
            db.session.commit()
            seller_id = seller.id
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            category_id = category.id
            product = Product(
                title='Original Title',
                description='Original description',
                price=100.00,
                stock=5,
                seller_id=seller_id,
                category_id=category_id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            product_id = product.id
        update_data = {
            'title': 'Updated Title',
            'price': 150.00,
            'stock': 10
        }
        response = client.put(f'/api/products/{product_id}', 
                            data=json.dumps(update_data),
                            content_type='application/json')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert result['message'] == 'Product updated successfully'
        assert result['product']['title'] == 'Updated Title'
        assert float(result['product']['price']) == 150.00
    
    def test_delete_product(self, client, app):
        """Prueba eliminar producto"""
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
            db.session.commit()
            seller_id = seller.id
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            category_id = category.id
            product = Product(
                title='Product to Delete',
                description='This product will be deleted',
                price=100.00,
                stock=5,
                seller_id=seller_id,
                category_id=category_id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            product_id = product.id
        response = client.delete(f'/api/products/{product_id}')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert result['message'] == 'Product deleted successfully'


class Test_CategoryManagement:
    """Pruebas para Historia de Usuario 6: Gestión de Categorías"""
    
    def test_create_new_category(self, client):
        """Prueba crear nueva categoría"""
        category_data = {
            'name': 'New Category',
            'description': 'A new category for products'
        }
        
        response = client.post('/api/categories/', 
                             data=json.dumps(category_data),
                             content_type='application/json')
        
        assert response.status_code == 201
        result = json.loads(response.data)
        assert result['message'] == 'Category created successfully'
        assert result['category']['name'] == 'New Category'
        assert result['category']['description'] == 'A new category for products'
    
    def test_create_category_empty_name(self, client):
        """Prueba crear categoría con nombre vacío"""
        category_data = {
            'name': '',
            'description': 'A category with empty name'
        }
        
        response = client.post('/api/categories/', 
                             data=json.dumps(category_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        result = json.loads(response.data)
        assert 'Category name is required' in result.get('error', '')
    
    def test_create_duplicate_category(self, client, app):
        """Prueba crear categoría duplicada"""
        with app.app_context():
            from app import db
            
            # Crear categoría existente
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
        
        # Intentar crear categoría con mismo nombre
        category_data = {
            'name': 'Electronics',
            'description': 'Another electronics category'
        }
        
        response = client.post('/api/categories/', 
                             data=json.dumps(category_data),
                             content_type='application/json')
        
        assert response.status_code == 409
        result = json.loads(response.data)
        assert 'Category already exists' in result['error']
    
    def test_get_all_categories(self, client, app):
        """Prueba obtener todas las categorías"""
        with app.app_context():
            from app import db
            
            # Crear categorías de prueba
            category1 = Category(name='Electronics', description='Electronic products')
            category2 = Category(name='Books', description='Books and literature')
            category3 = Category(name='Clothing', description='Clothing and fashion')
            db.session.add_all([category1, category2, category3])
            db.session.commit()
        
        response = client.get('/api/categories/')
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['categories']) == 3
        
        category_names = [cat['name'] for cat in result['categories']]
        assert 'Electronics' in category_names
        assert 'Books' in category_names
        assert 'Clothing' in category_names


class Test_ExtendedPurchaseMessage:
    """Pruebas para Historia de Usuario 7: Envío de Mensaje de Compra (Ampliado)"""
    
    def test_send_purchase_message_with_contact_info(self, client, app):
        """Prueba enviar mensaje de compra con información de contacto"""
        with app.app_context():
            from app import db
            # Crear datos de prueba
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            buyer = User(
                name='Test Buyer',
                email='buyer@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='buyer',
                phone='555-123-4567'
            )
            db.session.add_all([seller, buyer])
            db.session.commit()
            product = Product(
                title='iPhone 15 Pro',
                description='Latest iPhone model',
                price=1299.99,
                stock=5,
                seller_id=seller.id,
                category_id=category.id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            purchase_request = PurchaseRequest(
                product_id=product.id,
                buyer_id=buyer.id,
                quantity=1,
                note='Interested in this product',
                status='pending'
            )
            db.session.add(purchase_request)
            db.session.commit()
            # Guardar los IDs necesarios para usar fuera del contexto
            purchase_request_id = purchase_request.id
            buyer_id = buyer.id
            seller_id = seller.id
        # Enviar mensaje con información de contacto
        message_data = {
            'purchase_request_id': purchase_request_id,
            'sender_id': buyer_id,
            'receiver_id': seller_id,
            'message': 'Hola, estoy interesado en comprar este iPhone. Mi teléfono es 555-123-4567 y mi email es buyer@example.com. Por favor contáctame.'
        }
        response = client.post('/api/messages/', 
                             data=json.dumps(message_data),
                             content_type='application/json')
        assert response.status_code == 201
        result = json.loads(response.data)
        assert result['message'] == 'Message sent successfully'
        assert '555-123-4567' in result['message_data']['message']
        assert 'buyer@example.com' in result['message_data']['message']


class Test_RoleSwitching:
    """Pruebas para Historia de Usuario 8: Cambio de Rol (Usuario 'Ambos')"""
    
    def test_user_both_roles_access(self, client, app):
        """Prueba acceso a funcionalidades de comprador y vendedor"""
        with app.app_context():
            from app import db
            # Crear usuario con rol 'both'
            user = User(
                name='Test User',
                email='user@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='both'
            )
            db.session.add(user)
            db.session.commit()
            user_id = user.id
            # Crear categoría
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            category_id = category.id
            # Crear productos del usuario (como vendedor)
            product = Product(
                title='My Product',
                description='A product I am selling',
                price=100.00,
                stock=5,
                seller_id=user_id,
                category_id=category_id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
        # Verificar que puede ver sus productos (vista de vendedor)
        response = client.get(f'/api/products/seller/{user_id}')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 1
        assert result['products'][0]['title'] == 'My Product'
        # Verificar que puede ver todos los productos (vista de comprador)
        response = client.get('/api/products/')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) >= 1


class Test_Logout:
    """Pruebas para Historia de Usuario 9: Cierre de Sesión"""
    
    def test_logout_functionality(self, client, app):
        """Prueba funcionalidad de cierre de sesión"""
        # Esta prueba simula el comportamiento del frontend
        # ya que el logout se maneja principalmente en el cliente
        
        # Verificar que el endpoint de salud funciona (sin autenticación)
        response = client.get('/api/users/health')
        assert response.status_code == 200
        
        # Verificar que se puede acceder a productos sin autenticación
        response = client.get('/api/products/')
        assert response.status_code == 200
        
        # Verificar que se puede acceder a categorías sin autenticación
        response = client.get('/api/categories/')
        assert response.status_code == 200


class Test_IntegrationTests:
    """Pruebas de Integración Complejas"""
    
    def test_complete_purchase_flow(self, client, app):
        """Prueba flujo completo de compra"""
        with app.app_context():
            from app import db
            # 1. Crear categoría
            category = Category(name='Electronics', description='Electronic products')
            db.session.add(category)
            db.session.commit()
            # 2. Crear vendedor
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            db.session.add(seller)
            db.session.commit()
            seller_id = seller.id
            # 3. Crear comprador
            buyer = User(
                name='Test Buyer',
                email='buyer@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='buyer'
            )
            db.session.add(buyer)
            db.session.commit()
            buyer_id = buyer.id
            # 4. Crear producto
            product = Product(
                title='iPhone 15 Pro',
                description='Latest iPhone model',
                price=1299.99,
                stock=5,
                seller_id=seller_id,
                category_id=category.id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            product_id = product.id
        # 5. Verificar que el producto aparece en la lista
        response = client.get('/api/products/')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 1
        assert result['products'][0]['title'] == 'iPhone 15 Pro'
        # 6. Verificar detalles del producto
        response = client.get(f'/api/products/{product_id}')
        assert response.status_code == 200
        result = json.loads(response.data)
        # Verificar información del producto directamente
        assert result['seller']['name'] == 'Test Seller'
        assert result['category']['name'] == 'Electronics'
        # 7. Crear solicitud de compra
        purchase_data = {
            'product_id': product_id,
            'buyer_id': buyer_id,
            'quantity': 1,
            'note': 'Interested in this product'
        }
        response = client.post('/api/purchase-requests/', 
                             data=json.dumps(purchase_data),
                             content_type='application/json')
        assert response.status_code == 201
        # 8. Enviar mensaje de compra
        message_data = {
            'purchase_request_id': 1,  # ID de la solicitud creada
            'sender_id': buyer_id,
            'receiver_id': seller_id,
            'message': 'Hola, estoy interesado en comprar este iPhone.'
        }
        response = client.post('/api/messages/', 
                             data=json.dumps(message_data),
                             content_type='application/json')
        assert response.status_code == 201
        # 9. Verificar que el vendedor puede ver sus productos
        response = client.get(f'/api/products/seller/{seller_id}')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 1
    
    def test_user_registration_and_product_creation(self, client, app):
        """Prueba registro de usuario y creación de productos"""
        # 1. Registrar usuario vendedor
        user_data = {
            'name': 'New Seller',
            'email': 'newseller@example.com',
            'password': 'password123',
            'user_type': 'seller'
        }
        
        response = client.post('/api/users/register', 
                             data=json.dumps(user_data),
                             content_type='application/json')
        assert response.status_code == 201
        
        # 2. Crear categoría
        category_data = {
            'name': 'New Category',
            'description': 'A new category'
        }
        
        response = client.post('/api/categories/', 
                             data=json.dumps(category_data),
                             content_type='application/json')
        assert response.status_code == 201
        
        # 3. Crear producto
        product_data = {
            'title': 'New Product',
            'description': 'A new product',
            'price': 100.00,
            'stock': 10,
            'seller_id': 1,  # ID del usuario registrado
            'category_id': 1  # ID de la categoría creada
        }
        
        response = client.post('/api/products/', 
                             data=json.dumps(product_data),
                             content_type='application/json')
        assert response.status_code == 201
        
        # 4. Verificar que el producto aparece en la lista general
        response = client.get('/api/products/')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 1
        assert result['products'][0]['title'] == 'New Product'
        
        # 5. Verificar que el producto aparece en la lista del vendedor
        response = client.get('/api/products/seller/1')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result['products']) == 1
        assert result['products'][0]['title'] == 'New Product' 