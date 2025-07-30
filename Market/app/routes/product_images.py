from flask import Blueprint, request, jsonify
from .. import db
from ..models import ProductImage, Product

product_images_bp = Blueprint('product_images', __name__)

@product_images_bp.route('/product/<int:product_id>', methods=['GET'])
def get_product_images(product_id):
    """Get all images for a specific product"""
    try:
        # Check if product exists
        product = Product.query.get_or_404(product_id)
        
        images = ProductImage.query.filter_by(product_id=product_id).all()
        
        image_list = []
        for image in images:
            image_list.append({
                'id': image.id,
                'product_id': image.product_id,
                'image_url': image.image_url
            })
        
        return jsonify({'images': image_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get product images', 'details': str(e)}), 500

@product_images_bp.route('/', methods=['POST'])
def create_product_image():
    """Add a new image to a product"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['product_id', 'image_url']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if product exists
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Create new product image
        new_image = ProductImage(
            product_id=data['product_id'],
            image_url=data['image_url']
        )
        
        db.session.add(new_image)
        db.session.commit()
        
        return jsonify({
            'message': 'Product image added successfully',
            'image': {
                'id': new_image.id,
                'product_id': new_image.product_id,
                'image_url': new_image.image_url
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add product image', 'details': str(e)}), 500

@product_images_bp.route('/<int:image_id>', methods=['DELETE'])
def delete_product_image(image_id):
    """Delete a specific product image"""
    try:
        image = ProductImage.query.get_or_404(image_id)
        
        db.session.delete(image)
        db.session.commit()
        
        return jsonify({'message': 'Product image deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete product image', 'details': str(e)}), 500

@product_images_bp.route('/<int:image_id>', methods=['GET'])
def get_product_image(image_id):
    """Get a specific product image"""
    try:
        image = ProductImage.query.get_or_404(image_id)
        
        return jsonify({
            'id': image.id,
            'product_id': image.product_id,
            'image_url': image.image_url
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get product image', 'details': str(e)}), 500

@product_images_bp.route('/<int:image_id>', methods=['PUT'])
def update_product_image(image_id):
    """Update a product image URL"""
    try:
        image = ProductImage.query.get_or_404(image_id)
        data = request.get_json()
        
        if 'image_url' in data:
            image.image_url = data['image_url']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Product image updated successfully',
            'image': {
                'id': image.id,
                'product_id': image.product_id,
                'image_url': image.image_url
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update product image', 'details': str(e)}), 500 