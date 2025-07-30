from flask import Blueprint, request, jsonify
from .. import db
from ..models import Product, Category

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    """Get all active products with optional category filter"""
    try:
        category_id = request.args.get('category_id', type=int)
        
        # Base query for active products
        query = Product.query.filter_by(is_active=True)
        
        # Apply category filter if provided
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        products = query.all()
        
        product_list = []
        for product in products:
            product_list.append({
                'id': product.id,
                'title': product.title,
                'description': product.description,
                'price': float(product.price),
                'stock': product.stock,
                'category_id': product.category_id,
                'seller_id': product.seller_id
            })
        
        return jsonify({'products': product_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get products', 'details': str(e)}), 500

@products_bp.route('/', methods=['POST'])
def create_product():
    """Create a new product"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'price', 'stock', 'seller_id', 'category_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create new product
        new_product = Product(
            title=data['title'],
            description=data['description'],
            price=data['price'],
            stock=data['stock'],
            seller_id=data['seller_id'],
            category_id=data['category_id']
        )
        
        db.session.add(new_product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': {
                'id': new_product.id,
                'title': new_product.title,
                'price': float(new_product.price),
                'stock': new_product.stock
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create product', 'details': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product by ID"""
    try:
        product = Product.query.get_or_404(product_id)
        
        return jsonify({
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': float(product.price),
            'stock': product.stock,
            'category_id': product.category_id,
            'seller_id': product.seller_id,
            'is_active': product.is_active,
            'created_at': product.created_at.isoformat() if product.created_at else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get product', 'details': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product"""
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            product.title = data['title']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = data['price']
        if 'stock' in data:
            product.stock = data['stock']
        if 'category_id' in data:
            product.category_id = data['category_id']
        if 'is_active' in data:
            product.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': {
                'id': product.id,
                'title': product.title,
                'price': float(product.price),
                'stock': product.stock
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update product', 'details': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product (soft delete by setting is_active to False)"""
    try:
        product = Product.query.get_or_404(product_id)
        product.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete product', 'details': str(e)}), 500



