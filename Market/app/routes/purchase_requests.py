from flask import Blueprint, request, jsonify
from .. import db
from ..models import PurchaseRequest, Product, User

purchase_requests_bp = Blueprint('purchase_requests', __name__)

@purchase_requests_bp.route('/', methods=['GET'])
def get_purchase_requests():
    """Get all purchase requests"""
    try:
        purchase_requests = PurchaseRequest.query.all()
        
        request_list = []
        for req in purchase_requests:
            request_list.append({
                'id': req.id,
                'product_id': req.product_id,
                'buyer_id': req.buyer_id,
                'quantity': req.quantity,
                'note': req.note,
                'status': req.status,
                'created_at': req.created_at.isoformat() if req.created_at else None,
                'updated_at': req.updated_at.isoformat() if req.updated_at else None
            })
        
        return jsonify({'purchase_requests': request_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get purchase requests', 'details': str(e)}), 500

@purchase_requests_bp.route('/', methods=['POST'])
def create_purchase_request():
    """Create a new purchase request"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['product_id', 'buyer_id', 'quantity']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if product exists and is active
        product = Product.query.get(data['product_id'])
        if not product or not product.is_active:
            return jsonify({'error': 'Product not found or not available'}), 404
        
        # Check if buyer exists
        buyer = User.query.get(data['buyer_id'])
        if not buyer:
            return jsonify({'error': 'Buyer not found'}), 404
        
        # Create new purchase request
        new_request = PurchaseRequest(
            product_id=data['product_id'],
            buyer_id=data['buyer_id'],
            quantity=data['quantity'],
            note=data.get('note', ''),
            status='pending'
        )
        
        db.session.add(new_request)
        db.session.commit()
        
        return jsonify({
            'message': 'Purchase request created successfully',
            'purchase_request': {
                'id': new_request.id,
                'product_id': new_request.product_id,
                'buyer_id': new_request.buyer_id,
                'quantity': new_request.quantity,
                'status': new_request.status
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create purchase request', 'details': str(e)}), 500

@purchase_requests_bp.route('/<int:request_id>', methods=['PUT'])
def update_purchase_request(request_id):
    """Update purchase request status"""
    try:
        purchase_request = PurchaseRequest.query.get_or_404(request_id)
        data = request.get_json()
        
        # Validate status
        valid_statuses = ['pending', 'accepted', 'rejected', 'canceled']
        if 'status' in data:
            if data['status'] not in valid_statuses:
                return jsonify({'error': 'Invalid status'}), 400
            purchase_request.status = data['status']
        
        # Update note if provided
        if 'note' in data:
            purchase_request.note = data['note']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Purchase request updated successfully',
            'purchase_request': {
                'id': purchase_request.id,
                'status': purchase_request.status,
                'note': purchase_request.note
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update purchase request', 'details': str(e)}), 500

@purchase_requests_bp.route('/<int:request_id>', methods=['GET'])
def get_purchase_request(request_id):
    """Get a specific purchase request"""
    try:
        purchase_request = PurchaseRequest.query.get_or_404(request_id)
        
        return jsonify({
            'id': purchase_request.id,
            'product_id': purchase_request.product_id,
            'buyer_id': purchase_request.buyer_id,
            'quantity': purchase_request.quantity,
            'note': purchase_request.note,
            'status': purchase_request.status,
            'created_at': purchase_request.created_at.isoformat() if purchase_request.created_at else None,
            'updated_at': purchase_request.updated_at.isoformat() if purchase_request.updated_at else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get purchase request', 'details': str(e)}), 500 