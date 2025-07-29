import os

class Config:
    # Opción 1: SQLite (más fácil para desarrollo en Windows)
    # SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///market.db')
    
    # Opción 2: PostgreSQL para Windows (asumiendo que tienes PostgreSQL instalado)
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:admin@localhost:5432/mymarketdb')
    
    # Opción 3: Si usas XAMPP/WAMP con MySQL
    # SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'mysql://root:@localhost:3306/mymarketdb')
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key') 