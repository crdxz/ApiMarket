import pytest
import json
from app import db
from app.models import Category

class TestCategories:
    """Test cases for category endpoints."""
    
    def test_create_category_success(self, client, sample_category):
        """Test successful category creation."""
        response = client.post('/api/categories/',
                             data=json.dumps(sample_category),
                             content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'Category created successfully'
        assert 'category' in data
        assert data['category']['name'] == sample_category['name']
        assert data['category']['description'] == sample_category['description']
    
    def test_create_category_missing_name(self, client):
        """Test category creation with missing name."""
        incomplete_category = {
            'description': 'Test description'
            # Missing name
        }
        
        response = client.post('/api/categories/',
                             data=json.dumps(incomplete_category),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'name' in data['error']
    
    def test_create_category_empty_name(self, client):
        """Test category creation with empty name."""
        category_with_empty_name = {
            'name': '',
            'description': 'Test description'
        }
        
        response = client.post('/api/categories/',
                             data=json.dumps(category_with_empty_name),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_get_categories_empty(self, client):
        """Test getting categories when none exist."""
        response = client.get('/api/categories/')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'categories' in data
        assert len(data['categories']) == 0
    
    def test_get_categories_with_data(self, client, sample_category):
        """Test getting categories when they exist."""
        # Create a category first
        client.post('/api/categories/',
                   data=json.dumps(sample_category),
                   content_type='application/json')
        
        response = client.get('/api/categories/')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'categories' in data
        assert len(data['categories']) == 1
        assert data['categories'][0]['name'] == sample_category['name']
        assert data['categories'][0]['description'] == sample_category['description']
    
    def test_create_multiple_categories(self, client):
        """Test creating multiple categories."""
        categories = [
            {'name': 'Electronics', 'description': 'Electronic products'},
            {'name': 'Clothing', 'description': 'Clothing and accessories'},
            {'name': 'Books', 'description': 'Books and literature'}
        ]
        
        for category in categories:
            response = client.post('/api/categories/',
                                 data=json.dumps(category),
                                 content_type='application/json')
            assert response.status_code == 201
        
        # Check all categories were created
        response = client.get('/api/categories/')
        data = json.loads(response.data)
        assert len(data['categories']) == 3 