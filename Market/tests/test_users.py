import pytest
import json
from app import db
from app.models import User
from werkzeug.security import generate_password_hash

class TestUsers:
    """Test cases for user endpoints."""
    
    def test_user_registration_success(self, client, sample_user):
        """Test successful user registration."""
        response = client.post('/api/users/register',
                             data=json.dumps(sample_user),
                             content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'User registered successfully'
        assert 'user' in data
        assert data['user']['name'] == sample_user['name']
        assert data['user']['email'] == sample_user['email']
        assert data['user']['user_type'] == sample_user['user_type']
    
    def test_user_registration_missing_fields(self, client):
        """Test user registration with missing required fields."""
        incomplete_user = {
            'name': 'Test User',
            'email': 'test@example.com'
            # Missing password and user_type
        }
        
        response = client.post('/api/users/register',
                             data=json.dumps(incomplete_user),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_user_registration_duplicate_email(self, client, sample_user):
        """Test user registration with duplicate email."""
        # Register first user
        client.post('/api/users/register',
                   data=json.dumps(sample_user),
                   content_type='application/json')
        
        # Try to register with same email
        response = client.post('/api/users/register',
                             data=json.dumps(sample_user),
                             content_type='application/json')
        
        assert response.status_code == 409
        data = json.loads(response.data)
        assert 'error' in data
        assert 'already exists' in data['error']
    
    def test_user_login_success(self, client, sample_user):
        """Test successful user login."""
        # Register user first
        client.post('/api/users/register',
                   data=json.dumps(sample_user),
                   content_type='application/json')
        
        # Login
        login_data = {
            'email': sample_user['email'],
            'password': sample_user['password']
        }
        
        response = client.post('/api/users/login',
                             data=json.dumps(login_data),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Login successful'
        assert 'user' in data
        assert data['user']['email'] == sample_user['email']
    
    def test_user_login_invalid_credentials(self, client):
        """Test login with invalid credentials."""
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'wrongpassword'
        }
        
        response = client.post('/api/users/login',
                             data=json.dumps(login_data),
                             content_type='application/json')
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_user_login_missing_fields(self, client):
        """Test login with missing fields."""
        login_data = {
            'email': 'test@example.com'
            # Missing password
        }
        
        response = client.post('/api/users/login',
                             data=json.dumps(login_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_get_users(self, client, sample_user):
        """Test getting all users."""
        # Register a user first
        client.post('/api/users/register',
                   data=json.dumps(sample_user),
                   content_type='application/json')
        
        response = client.get('/api/users/')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'users' in data
        assert len(data['users']) == 1
        assert data['users'][0]['name'] == sample_user['name']
    
    def test_test_endpoint(self, client):
        """Test the test endpoint."""
        response = client.get('/api/users/test')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Users API is working!' 