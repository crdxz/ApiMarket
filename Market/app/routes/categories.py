from flask import Blueprint, request, jsonify
from .. import db
from ..models import Category

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.all()
        
        category_list = []
        for category in categories:
            category_list.append({
                'id': category.id,
                'name': category.name,
                'description': category.description
            })
        
        return jsonify({'categories': category_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get categories', 'details': str(e)}), 500

@categories_bp.route('/', methods=['POST'])
def create_category():
    """Create a new category"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Category name is required'}), 400
        
        # Create new category
        new_category = Category(
            name=data['name'],
            description=data.get('description', '')
        )
        
        db.session.add(new_category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': {
                'id': new_category.id,
                'name': new_category.name,
                'description': new_category.description
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create category', 'details': str(e)}), 500 