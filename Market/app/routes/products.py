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
        
        # Get seller and category information
        from ..models import User
        product_list = []
        for product in products:
            # Get seller information
            seller = User.query.get(product.seller_id)
            seller_name = seller.name if seller else 'Anónimo'
            
            # Get category information
            category = Category.query.get(product.category_id)
            category_name = category.name if category else 'Sin categoría'
            
            product_list.append({
                'id': product.id,
                'title': product.title,
                'description': product.description,
                'price': float(product.price),
                'stock': product.stock,
                'category_id': product.category_id,
                'category_name': category_name,
                'seller_id': product.seller_id,
                'seller_name': seller_name
            })
        
        return jsonify({'products': product_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get products', 'details': str(e)}), 500

@products_bp.route('/seller/<int:seller_id>', methods=['GET'])
def get_products_by_seller(seller_id):
    """Get all products by a specific seller"""
    try:
        products = Product.query.filter_by(seller_id=seller_id).all()
        
        # Get seller and category information
        from ..models import User
        product_list = []
        for product in products:
            # Get seller information
            seller = User.query.get(product.seller_id)
            seller_name = seller.name if seller else 'Anónimo'
            
            # Get category information
            category = Category.query.get(product.category_id)
            category_name = category.name if category else 'Sin categoría'
            
            product_list.append({
                'id': product.id,
                'title': product.title,
                'description': product.description,
                'price': float(product.price),
                'stock': product.stock,
                'category_id': product.category_id,
                'category_name': category_name,
                'seller_id': product.seller_id,
                'seller_name': seller_name,
                'is_active': product.is_active,
                'created_at': product.created_at.isoformat() if product.created_at else None
            })
        
        return jsonify({'products': product_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get products by seller', 'details': str(e)}), 500

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
    """Get a specific product by ID with seller and category information"""
    try:
        product = Product.query.get_or_404(product_id)
        
        # Get seller information
        from ..models import User
        seller = User.query.get(product.seller_id)
        seller_info = None
        if seller:
            seller_info = {
                'id': seller.id,
                'name': seller.name,
                'email': seller.email,
                'phone': seller.phone,
                'address': seller.address,
                'user_type': seller.user_type,
                'created_at': seller.created_at.isoformat() if seller.created_at else None
            }
        
        # Get category information
        category = Category.query.get(product.category_id)
        category_info = None
        if category:
            category_info = {
                'id': category.id,
                'name': category.name,
                'description': category.description
            }
        
        return jsonify({
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': float(product.price),
            'stock': product.stock,
            'category_id': product.category_id,
            'category': category_info,
            'seller_id': product.seller_id,
            'seller': seller_info,
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
    """Delete a product permanently"""
    try:
        product = Product.query.get_or_404(product_id)
        
        # Import ProductImage model
        from ..models import ProductImage
        
        # Delete associated product images first using raw SQL to ensure it works
        from sqlalchemy import text
        db.session.execute(
            text('DELETE FROM product_images WHERE product_id = :product_id'),
            {'product_id': product_id}
        )
        
        # Delete the product
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete product', 'details': str(e)}), 500



