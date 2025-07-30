from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Initialize extensions

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Enable CORS
    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Import models to register them with SQLAlchemy
    from . import models

    # Blueprints will be registered here
    from .routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix='/api/users')

    from .routes.products import products_bp
    app.register_blueprint(products_bp, url_prefix='/api/products')
    
    from .routes.categories import categories_bp
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    
    from .routes.purchase_requests import purchase_requests_bp
    app.register_blueprint(purchase_requests_bp, url_prefix='/api/purchase-requests')
    
    from .routes.messages import messages_bp
    app.register_blueprint(messages_bp, url_prefix='/api/messages')
    
    from .routes.transactions import transactions_bp
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    
    from .routes.product_images import product_images_bp
    app.register_blueprint(product_images_bp, url_prefix='/api/product-images')

    return app 