import pytest
import json
from app import db
from app.models import Product, User, Category

class TestProducts:
    """Test cases for product endpoints."""
    
    def test_create_product_success(self, client, sample_product):
        """Test successful product creation."""
        # First create a user and category
        user_data = {
            'name': 'Test Seller',
            'email': 'seller@example.com',
            'password': 'password123',
            'user_type': 'seller'
        }
        client.post('/api/users/register',
                   data=json.dumps(user_data),
                   content_type='application/json')
        
        category_data = {
            'name': 'Electronics',
            'description': 'Electronic products'
        }
        client.post('/api/categories/',
                   data=json.dumps(category_data),
                   content_type='application/json')
        
        response = client.post('/api/products/',
                             data=json.dumps(sample_product),
                             content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'Product created successfully'
        assert 'product' in data
        assert data['product']['title'] == sample_product['title']
        assert data['product']['price'] == sample_product['price']
    
    def test_create_product_missing_fields(self, client):
        """Test product creation with missing required fields."""
        incomplete_product = {
            'title': 'Test Product',
            'price': 99.99
            # Missing required fields
        }
        
        response = client.post('/api/products/',
                             data=json.dumps(incomplete_product),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_get_products_empty(self, client):
        """Test getting products when none exist."""
        response = client.get('/api/products/')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'products' in data
        assert len(data['products']) == 0
    
    def test_get_products_with_data(self, client, sample_product):
        """Test getting products when they exist."""
        # Create user and category first
        user_data = {
            'name': 'Test Seller',
            'email': 'seller@example.com',
            'password': 'password123',
            'user_type': 'seller'
        }
        client.post('/api/users/register',
                   data=json.dumps(user_data),
                   content_type='application/json')
        
        category_data = {
            'name': 'Electronics',
            'description': 'Electronic products'
        }
        client.post('/api/categories/',
                   data=json.dumps(category_data),
                   content_type='application/json')
        
        # Create a product
        client.post('/api/products/',
                   data=json.dumps(sample_product),
                   content_type='application/json')
        
        response = client.get('/api/products/')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'products' in data
        assert len(data['products']) == 1
        assert data['products'][0]['title'] == sample_product['title']
    
    def test_get_product_by_id(self, client, sample_product):
        """Test getting a specific product by ID."""
        # Create user and category first
        user_data = {
            'name': 'Test Seller',
            'email': 'seller@example.com',
            'password': 'password123',
            'user_type': 'seller'
        }
        client.post('/api/users/register',
                   data=json.dumps(user_data),
                   content_type='application/json')
        
        category_data = {
            'name': 'Electronics',
            'description': 'Electronic products'
        }
        client.post('/api/categories/',
                   data=json.dumps(category_data),
                   content_type='application/json')
        
        # Create a product
        client.post('/api/products/',
                   data=json.dumps(sample_product),
                   content_type='application/json')
        
        response = client.get('/api/products/1')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['title'] == sample_product['title']
        assert data['price'] == sample_product['price']
        assert data['stock'] == sample_product['stock']
    
    def test_get_product_not_found(self, client):
        """Test getting a product that doesn't exist."""
        response = client.get('/api/products/999')
        
        assert response.status_code == 404
    
    def test_update_product(self, client, sample_product):
        """Test updating a product."""
        # Create user and category first
        user_data = {
            'name': 'Test Seller',
            'email': 'seller@example.com',
            'password': 'password123',
            'user_type': 'seller'
        }
        client.post('/api/users/register',
                   data=json.dumps(user_data),
                   content_type='application/json')
        
        category_data = {
            'name': 'Electronics',
            'description': 'Electronic products'
        }
        client.post('/api/categories/',
                   data=json.dumps(category_data),
                   content_type='application/json')
        
        # Create a product
        client.post('/api/products/',
                   data=json.dumps(sample_product),
                   content_type='application/json')
        
        # Update the product
        update_data = {
            'title': 'Updated Product',
            'price': 149.99,
            'stock': 5
        }
        
        response = client.put('/api/products/1',
                            data=json.dumps(update_data),
                            content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Product updated successfully'
        assert data['product']['title'] == 'Updated Product'
        assert data['product']['price'] == 149.99
    
    def test_delete_product(self, client, sample_product):
        """Test deleting a product (soft delete)."""
        # Create user and category first
        user_data = {
            'name': 'Test Seller',
            'email': 'seller@example.com',
            'password': 'password123',
            'user_type': 'seller'
        }
        client.post('/api/users/register',
                   data=json.dumps(user_data),
                   content_type='application/json')
        
        category_data = {
            'name': 'Electronics',
            'description': 'Electronic products'
        }
        client.post('/api/categories/',
                   data=json.dumps(category_data),
                   content_type='application/json')
        
        # Create a product
        client.post('/api/products/',
                   data=json.dumps(sample_product),
                   content_type='application/json')
        
        # Delete the product
        response = client.delete('/api/products/1')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Product deleted successfully'
        
        # Verify product is not returned in GET request (soft delete)
        get_response = client.get('/api/products/')
        get_data = json.loads(get_response.data)
        assert len(get_data['products']) == 0 