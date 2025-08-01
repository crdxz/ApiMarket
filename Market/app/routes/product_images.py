from flask import Blueprint, request, jsonify, current_app, url_for
import os
import uuid
from werkzeug.utils import secure_filename
from .. import db
from ..models import ProductImage, Product

product_images_bp = Blueprint('product_images', __name__)

# Configuración para subida de archivos
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
UPLOAD_FOLDER = 'static/product_images'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_full_image_url(image_url):
    """Convert relative image URL to full URL"""
    if image_url.startswith('http'):
        return image_url
    # Construir URL completa usando el host de la request
    request_host = request.host_url.rstrip('/')
    return f"{request_host}{image_url}"

@product_images_bp.route('/upload', methods=['POST'])
def upload_product_image():
    """Upload a new product image"""
    try:
        # Verificar si hay archivo en la petición
        if 'image' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['image']
        product_id = request.form.get('product_id')
        
        # Verificar si se seleccionó un archivo
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        # Verificar si el producto existe
        if not product_id:
            return jsonify({'error': 'Product ID is required'}), 400
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Verificar extensión del archivo
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Allowed types: png, jpg, jpeg, gif, webp'}), 400
        
        # Crear directorio si no existe
        upload_path = os.path.join(current_app.root_path, UPLOAD_FOLDER)
        os.makedirs(upload_path, exist_ok=True)
        
        # Generar nombre único para el archivo
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Guardar archivo
        file_path = os.path.join(upload_path, unique_filename)
        file.save(file_path)
        
        # Crear URL relativa para la base de datos
        image_url = f"/static/product_images/{unique_filename}"
        
        # Crear registro en la base de datos
        new_image = ProductImage(
            product_id=product_id,
            image_url=image_url
        )
        
        db.session.add(new_image)
        db.session.commit()
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'image': {
                'id': new_image.id,
                'product_id': new_image.product_id,
                'image_url': new_image.image_url,
                'full_image_url': get_full_image_url(new_image.image_url)
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to upload image', 'details': str(e)}), 500

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
                'image_url': image.image_url,
                'full_image_url': get_full_image_url(image.image_url)
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
                'image_url': new_image.image_url,
                'full_image_url': get_full_image_url(new_image.image_url)
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
            'image_url': image.image_url,
            'full_image_url': get_full_image_url(image.image_url)
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
                'image_url': image.image_url,
                'full_image_url': get_full_image_url(image.image_url)
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update product image', 'details': str(e)}), 500 