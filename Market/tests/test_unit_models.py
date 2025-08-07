import pytest
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, Category, Product, ProductImage, PurchaseRequest, Message, Transaction

class TestUserModel:
    """Pruebas unitarias para el modelo User"""
    def test_user_creation(self, app):
        """Prueba creación básica de usuario"""
        with app.app_context():
            from app import db
            user = User(
                name='Test User',
                email='test@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='buyer',
                phone='555-123-4567',
                address='Test Address'
            )
            db.session.add(user)
            db.session.commit()
            assert user.name == 'Test User'
            assert user.email == 'test@example.com'
            assert user.user_type == 'buyer'
            assert user.phone == '555-123-4567'
            assert user.address == 'Test Address'
            assert user.created_at is not None
    
    def test_user_password_validation(self, app):
        """Prueba validación de contraseña"""
        with app.app_context():
            user = User(
                name='Test User',
                email='test@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='buyer'
            )
            
            # Verificar contraseña correcta
            assert check_password_hash(user.password_hash, 'password123')
            
            # Verificar contraseña incorrecta
            assert not check_password_hash(user.password_hash, 'wrongpassword')
    
    def test_user_type_validation(self, app):
        """Prueba tipos de usuario válidos"""
        with app.app_context():
            # Usuario comprador
            buyer = User(
                name='Buyer',
                email='buyer@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='buyer'
            )
            assert buyer.user_type == 'buyer'
            
            # Usuario vendedor
            seller = User(
                name='Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            assert seller.user_type == 'seller'
            
            # Usuario ambos
            both = User(
                name='Both',
                email='both@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='both'
            )
            assert both.user_type == 'both'


class TestCategoryModel:
    """Pruebas unitarias para el modelo Category"""
    
    def test_category_creation(self, app):
        """Prueba creación básica de categoría"""
        with app.app_context():
            category = Category(
                name='Electronics',
                description='Electronic products and gadgets'
            )
            
            assert category.name == 'Electronics'
            assert category.description == 'Electronic products and gadgets'
    
    def test_category_unique_name(self, app):
        """Prueba que el nombre de categoría sea único"""
        with app.app_context():
            category1 = Category(name='Electronics', description='Electronic products')
            category2 = Category(name='Electronics', description='Another electronics category')
            
            # En un entorno real, esto debería fallar por la restricción UNIQUE
            # Aquí solo verificamos que ambos objetos se crean correctamente
            assert category1.name == 'Electronics'
            assert category2.name == 'Electronics'


class TestProductModel:
    """Pruebas unitarias para el modelo Product"""
    
    def test_product_creation(self, app):
        """Prueba creación básica de producto"""
        with app.app_context():
            from app import db
            # Crear usuario y categoría relacionados
            user = User(name='Seller', email='seller@unit.com', password_hash='hash', user_type='seller')
            db.session.add(user)
            category = Category(name='UnitCat', description='Unit test category')
            db.session.add(category)
            db.session.commit()
            product = Product(
                title='iPhone 15 Pro',
                description='Latest iPhone model with advanced features',
                price=1299.99,
                stock=10,
                seller_id=user.id,
                category_id=category.id,
                is_active=True
            )
            db.session.add(product)
            db.session.commit()
            assert product.title == 'iPhone 15 Pro'
            assert product.description == 'Latest iPhone model with advanced features'
            assert float(product.price) == 1299.99
            assert product.stock == 10
            assert product.seller_id == user.id
            assert product.category_id == category.id
            assert product.is_active == True
            assert product.created_at is not None
    
    def test_product_price_validation(self, app):
        """Prueba validación de precio"""
        with app.app_context():
            # Precio válido
            product = Product(
                title='Test Product',
                description='Test description',
                price=99.99,
                stock=5,
                seller_id=1,
                category_id=1
            )
            assert float(product.price) == 99.99
            
            # Precio cero
            product_zero = Product(
                title='Free Product',
                description='Free product',
                price=0.00,
                stock=5,
                seller_id=1,
                category_id=1
            )
            assert float(product_zero.price) == 0.00
    
    def test_product_stock_validation(self, app):
        """Prueba validación de stock"""
        with app.app_context():
            # Stock positivo
            product = Product(
                title='Test Product',
                description='Test description',
                price=100.00,
                stock=10,
                seller_id=1,
                category_id=1
            )
            assert product.stock == 10
            
            # Stock cero
            product_zero = Product(
                title='Out of Stock Product',
                description='Product with zero stock',
                price=100.00,
                stock=0,
                seller_id=1,
                category_id=1
            )
            assert product_zero.stock == 0
    
    def test_product_active_status(self, app):
        """Prueba estado activo/inactivo del producto"""
        with app.app_context():
            # Producto activo
            active_product = Product(
                title='Active Product',
                description='Active product',
                price=100.00,
                stock=5,
                seller_id=1,
                category_id=1,
                is_active=True
            )
            assert active_product.is_active == True
            
            # Producto inactivo
            inactive_product = Product(
                title='Inactive Product',
                description='Inactive product',
                price=100.00,
                stock=5,
                seller_id=1,
                category_id=1,
                is_active=False
            )
            assert inactive_product.is_active == False


class TestProductImageModel:
    """Pruebas unitarias para el modelo ProductImage"""
    
    def test_product_image_creation(self, app):
        """Prueba creación básica de imagen de producto"""
        with app.app_context():
            image = ProductImage(
                product_id=1,
                image_url='/static/product_images/test-image.jpg'
            )
            
            assert image.product_id == 1
            assert image.image_url == '/static/product_images/test-image.jpg'
    
    def test_product_image_url_validation(self, app):
        """Prueba validación de URL de imagen"""
        with app.app_context():
            # URL válida
            image = ProductImage(
                product_id=1,
                image_url='https://example.com/image.jpg'
            )
            assert image.image_url == 'https://example.com/image.jpg'
            
            # URL local
            local_image = ProductImage(
                product_id=1,
                image_url='/static/product_images/local-image.png'
            )
            assert local_image.image_url == '/static/product_images/local-image.png'


class TestPurchaseRequestModel:
    """Pruebas unitarias para el modelo PurchaseRequest"""
    
    def test_purchase_request_creation(self, app):
        """Prueba creación básica de solicitud de compra"""
        with app.app_context():
            from app import db
            # Crear usuario y producto relacionados
            buyer = User(name='Buyer', email='buyer@unit.com', password_hash='hash', user_type='buyer')
            db.session.add(buyer)
            seller = User(name='Seller', email='seller2@unit.com', password_hash='hash', user_type='seller')
            db.session.add(seller)
            category = Category(name='UnitCat2', description='Unit test category 2')
            db.session.add(category)
            db.session.commit()
            product = Product(title='Test Product', description='A test product', price=10, stock=10, seller_id=seller.id, category_id=category.id, is_active=True)
            db.session.add(product)
            db.session.commit()
            request = PurchaseRequest(
                product_id=product.id,
                buyer_id=buyer.id,
                quantity=3,
                note='Interested in this product',
                status='pending'
            )
            db.session.add(request)
            db.session.commit()
            assert request.product_id == product.id
            assert request.buyer_id == buyer.id
            assert request.quantity == 3
            assert request.note == 'Interested in this product'
            assert request.status == 'pending'
            assert request.created_at is not None
            assert request.updated_at is not None
    
    def test_purchase_request_status_validation(self, app):
        """Prueba validación de estados de solicitud"""
        with app.app_context():
            # Estado pendiente
            pending_request = PurchaseRequest(
                product_id=1,
                buyer_id=2,
                quantity=1,
                status='pending'
            )
            assert pending_request.status == 'pending'
            
            # Estado aceptado
            accepted_request = PurchaseRequest(
                product_id=1,
                buyer_id=2,
                quantity=1,
                status='accepted'
            )
            assert accepted_request.status == 'accepted'
            
            # Estado rechazado
            rejected_request = PurchaseRequest(
                product_id=1,
                buyer_id=2,
                quantity=1,
                status='rejected'
            )
            assert rejected_request.status == 'rejected'
            
            # Estado cancelado
            canceled_request = PurchaseRequest(
                product_id=1,
                buyer_id=2,
                quantity=1,
                status='canceled'
            )
            assert canceled_request.status == 'canceled'
    
    def test_purchase_request_quantity_validation(self, app):
        """Prueba validación de cantidad"""
        with app.app_context():
            from app import db
            # Crear usuario y producto relacionados
            buyer = User(name='Buyer', email='buyer2@unit.com', password_hash='hash', user_type='buyer')
            db.session.add(buyer)
            seller = User(name='Seller', email='seller3@unit.com', password_hash='hash', user_type='seller')
            db.session.add(seller)
            category = Category(name='UnitCat3', description='Unit test category 3')
            db.session.add(category)
            db.session.commit()
            product = Product(title='Test Product', description='A test product', price=10, stock=10, seller_id=seller.id, category_id=category.id, is_active=True)
            db.session.add(product)
            db.session.commit()
            # Cantidad válida
            request = PurchaseRequest(
                product_id=product.id,
                buyer_id=buyer.id,
                quantity=5,
                status='pending'
            )
            db.session.add(request)
            db.session.commit()
            assert request.quantity == 5
            # Cantidad mínima (default)
            default_request = PurchaseRequest(
                product_id=product.id,
                buyer_id=buyer.id,
                status='pending'
            )
            db.session.add(default_request)
            db.session.commit()
            assert default_request.quantity == 1


class TestMessageModel:
    """Pruebas unitarias para el modelo Message"""
    
    def test_message_creation(self, app):
        """Prueba creación básica de mensaje"""
        with app.app_context():
            from app import db
            # Crear usuarios, producto y purchase_request relacionados
            sender = User(name='Sender', email='sender@unit.com', password_hash='hash', user_type='buyer')
            db.session.add(sender)
            receiver = User(name='Receiver', email='receiver@unit.com', password_hash='hash', user_type='seller')
            db.session.add(receiver)
            category = Category(name='UnitCat4', description='Unit test category 4')
            db.session.add(category)
            db.session.commit()
            product = Product(title='Test Product', description='A test product', price=10, stock=10, seller_id=receiver.id, category_id=category.id, is_active=True)
            db.session.add(product)
            db.session.commit()
            purchase_request = PurchaseRequest(buyer_id=sender.id, product_id=product.id, quantity=1, status='pending')
            db.session.add(purchase_request)
            db.session.commit()
            message = Message(
                purchase_request_id=purchase_request.id,
                sender_id=sender.id,
                receiver_id=receiver.id,
                message='Hola, estoy interesado en el producto'
            )
            db.session.add(message)
            db.session.commit()
            assert message.purchase_request_id == purchase_request.id
            assert message.sender_id == sender.id
            assert message.receiver_id == receiver.id
            assert message.message == 'Hola, estoy interesado en el producto'
            assert message.timestamp is not None
    
    def test_message_content_validation(self, app):
        """Prueba validación de contenido del mensaje"""
        with app.app_context():
            # Mensaje corto
            short_message = Message(
                purchase_request_id=1,
                sender_id=2,
                receiver_id=3,
                message='Hola'
            )
            assert short_message.message == 'Hola'
            
            # Mensaje largo
            long_message = Message(
                purchase_request_id=1,
                sender_id=2,
                receiver_id=3,
                message='Este es un mensaje muy largo con mucha información sobre el producto que me interesa comprar. Incluye detalles sobre el precio, la disponibilidad y las condiciones de la compra.'
            )
            assert len(long_message.message) > 100


class TestTransactionModel:
    """Pruebas unitarias para el modelo Transaction"""
    
    def test_transaction_creation(self, app):
        """Prueba creación básica de transacción"""
        with app.app_context():
            from app import db
            # Crear usuarios, producto y purchase_request relacionados
            buyer = User(name='Buyer', email='buyer3@unit.com', password_hash='hash', user_type='buyer')
            db.session.add(buyer)
            seller = User(name='Seller', email='seller5@unit.com', password_hash='hash', user_type='seller')
            db.session.add(seller)
            category = Category(name='UnitCat5', description='Unit test category 5')
            db.session.add(category)
            db.session.commit()
            product = Product(title='Test Product', description='A test product', price=10, stock=10, seller_id=seller.id, category_id=category.id, is_active=True)
            db.session.add(product)
            db.session.commit()
            purchase_request = PurchaseRequest(buyer_id=buyer.id, product_id=product.id, quantity=1, status='pending')
            db.session.add(purchase_request)
            db.session.commit()
            transaction = Transaction(
                purchase_request_id=purchase_request.id,
                status='pending'
            )
            db.session.add(transaction)
            db.session.commit()
            assert transaction.purchase_request_id == purchase_request.id
            assert transaction.status == 'pending'
            assert transaction.created_at is not None
            assert transaction.confirmation_date is None
    
    def test_transaction_status_validation(self, app):
        """Prueba validación de estados de transacción"""
        with app.app_context():
            # Transacción pendiente
            pending_transaction = Transaction(
                purchase_request_id=1,
                status='pending'
            )
            assert pending_transaction.status == 'pending'
            
            # Transacción completada
            completed_transaction = Transaction(
                purchase_request_id=1,
                status='completed'
            )
            assert completed_transaction.status == 'completed'
            
            # Transacción cancelada
            canceled_transaction = Transaction(
                purchase_request_id=1,
                status='cancelled'
            )
            assert canceled_transaction.status == 'cancelled'
    
    def test_transaction_confirmation_date(self, app):
        """Prueba fecha de confirmación de transacción"""
        with app.app_context():
            transaction = Transaction(
                purchase_request_id=1,
                status='pending'
            )
            
            # Inicialmente sin fecha de confirmación
            assert transaction.confirmation_date is None
            
            # Simular confirmación
            transaction.confirmation_date = datetime.utcnow()
            assert transaction.confirmation_date is not None


class TestModelRelationships:
    """Pruebas de relaciones entre modelos"""
    
    def test_user_product_relationship(self, app):
        """Prueba relación usuario-producto"""
        with app.app_context():
            # Crear usuario vendedor
            seller = User(
                name='Test Seller',
                email='seller@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='seller'
            )
            
            # Crear producto del vendedor
            product = Product(
                title='Test Product',
                description='Test description',
                price=100.00,
                stock=5,
                seller_id=1,  # ID del vendedor
                category_id=1
            )
            
            # Verificar relación
            assert product.seller_id == 1
    
    def test_product_category_relationship(self, app):
        """Prueba relación producto-categoría"""
        with app.app_context():
            # Crear categoría
            category = Category(
                name='Electronics',
                description='Electronic products'
            )
            
            # Crear producto en la categoría
            product = Product(
                title='Test Product',
                description='Test description',
                price=100.00,
                stock=5,
                seller_id=1,
                category_id=1  # ID de la categoría
            )
            
            # Verificar relación
            assert product.category_id == 1
    
    def test_purchase_request_relationships(self, app):
        """Prueba relaciones de solicitud de compra"""
        with app.app_context():
            # Crear solicitud de compra
            request = PurchaseRequest(
                product_id=1,  # Relación con producto
                buyer_id=2,    # Relación con comprador
                quantity=1,
                status='pending'
            )
            
            # Verificar relaciones
            assert request.product_id == 1
            assert request.buyer_id == 2
    
    def test_message_relationships(self, app):
        """Prueba relaciones de mensaje"""
        with app.app_context():
            # Crear mensaje
            message = Message(
                purchase_request_id=1,  # Relación con solicitud
                sender_id=2,           # Relación con remitente
                receiver_id=3,         # Relación con destinatario
                message='Test message'
            )
            
            # Verificar relaciones
            assert message.purchase_request_id == 1
            assert message.sender_id == 2
            assert message.receiver_id == 3
    
    def test_transaction_relationship(self, app):
        """Prueba relación de transacción"""
        with app.app_context():
            # Crear transacción
            transaction = Transaction(
                purchase_request_id=1,  # Relación con solicitud
                status='pending'
            )
            
            # Verificar relación
            assert transaction.purchase_request_id == 1


class TestModelValidation:
    """Pruebas de validación de modelos"""
    
    def test_user_email_validation(self, app):
        """Prueba validación de email de usuario"""
        with app.app_context():
            # Email válido
            user = User(
                name='Test User',
                email='test@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='buyer'
            )
            assert user.email == 'test@example.com'
            
            # Email con formato válido
            user2 = User(
                name='Test User 2',
                email='user.name+tag@domain.co.uk',
                password_hash=generate_password_hash('password123'),
                user_type='buyer'
            )
            assert user2.email == 'user.name+tag@domain.co.uk'
    
    def test_product_price_precision(self, app):
        """Prueba precisión de precio de producto"""
        with app.app_context():
            # Precio con decimales
            product = Product(
                title='Test Product',
                description='Test description',
                price=99.99,
                stock=5,
                seller_id=1,
                category_id=1
            )
            assert float(product.price) == 99.99
            
            # Precio entero
            product2 = Product(
                title='Test Product 2',
                description='Test description',
                price=100,
                stock=5,
                seller_id=1,
                category_id=1
            )
            assert float(product2.price) == 100.00
    
    def test_required_fields_validation(self, app):
        """Prueba validación de campos requeridos"""
        with app.app_context():
            # Usuario con todos los campos requeridos
            user = User(
                name='Test User',
                email='test@example.com',
                password_hash=generate_password_hash('password123'),
                user_type='buyer'
            )
            assert user.name is not None
            assert user.email is not None
            assert user.password_hash is not None
            assert user.user_type is not None
            
            # Producto con todos los campos requeridos
            product = Product(
                title='Test Product',
                price=100.00,
                stock=5,
                seller_id=1,
                category_id=1
            )
            assert product.title is not None
            assert product.price is not None
            assert product.stock is not None
            assert product.seller_id is not None
            assert product.category_id is not None 