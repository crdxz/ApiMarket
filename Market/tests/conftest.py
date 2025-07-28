import pytest
import tempfile
import os
from app import create_app, db
from app.models import User, Category, Product, PurchaseRequest, Message, Transaction

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # Create a temporary file to isolate the database for each test
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app()
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'WTF_CSRF_ENABLED': False
    })

    # Create the database and load test data
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()

@pytest.fixture
def sample_user():
    """Create a sample user for testing."""
    return {
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'password123',
        'user_type': 'buyer',
        'phone': '123456789',
        'address': 'Test Address'
    }

@pytest.fixture
def sample_category():
    """Create a sample category for testing."""
    return {
        'name': 'Electronics',
        'description': 'Electronic products'
    }

@pytest.fixture
def sample_product():
    """Create a sample product for testing."""
    return {
        'title': 'Test Product',
        'description': 'Test product description',
        'price': 99.99,
        'stock': 10,
        'seller_id': 1,
        'category_id': 1
    } 