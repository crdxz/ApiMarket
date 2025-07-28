from flask import Blueprint, request, jsonify
from datetime import datetime
from .. import db
from ..models import Transaction, PurchaseRequest

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/', methods=['GET'])
def get_transactions():
    """Get all transactions"""
    try:
        transactions = Transaction.query.all()
        
        transaction_list = []
        for trans in transactions:
            transaction_list.append({
                'id': trans.id,
                'purchase_request_id': trans.purchase_request_id,
                'status': trans.status,
                'confirmation_date': trans.confirmation_date.isoformat() if trans.confirmation_date else None
            })
        
        return jsonify({'transactions': transaction_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get transactions', 'details': str(e)}), 500

@transactions_bp.route('/', methods=['POST'])
def create_transaction():
    """Create a new transaction"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['purchase_request_id', 'status']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if purchase request exists
        purchase_request = PurchaseRequest.query.get(data['purchase_request_id'])
        if not purchase_request:
            return jsonify({'error': 'Purchase request not found'}), 404
        
        # Validate status
        valid_statuses = ['in_progress', 'completed', 'canceled']
        if data['status'] not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Set confirmation date if status is completed
        confirmation_date = None
        if data['status'] == 'completed':
            confirmation_date = datetime.utcnow()
        
        # Create new transaction
        new_transaction = Transaction(
            purchase_request_id=data['purchase_request_id'],
            status=data['status'],
            confirmation_date=confirmation_date
        )
        
        db.session.add(new_transaction)
        db.session.commit()
        
        return jsonify({
            'message': 'Transaction created successfully',
            'transaction': {
                'id': new_transaction.id,
                'purchase_request_id': new_transaction.purchase_request_id,
                'status': new_transaction.status,
                'confirmation_date': new_transaction.confirmation_date.isoformat() if new_transaction.confirmation_date else None
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create transaction', 'details': str(e)}), 500

@transactions_bp.route('/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    """Update transaction status"""
    try:
        transaction = Transaction.query.get_or_404(transaction_id)
        data = request.get_json()
        
        # Validate status
        valid_statuses = ['in_progress', 'completed', 'canceled']
        if 'status' in data:
            if data['status'] not in valid_statuses:
                return jsonify({'error': 'Invalid status'}), 400
            
            transaction.status = data['status']
            
            # Update confirmation date if status is completed
            if data['status'] == 'completed':
                transaction.confirmation_date = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Transaction updated successfully',
            'transaction': {
                'id': transaction.id,
                'status': transaction.status,
                'confirmation_date': transaction.confirmation_date.isoformat() if transaction.confirmation_date else None
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update transaction', 'details': str(e)}), 500

@transactions_bp.route('/<int:transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    """Get a specific transaction"""
    try:
        transaction = Transaction.query.get_or_404(transaction_id)
        
        return jsonify({
            'id': transaction.id,
            'purchase_request_id': transaction.purchase_request_id,
            'status': transaction.status,
            'confirmation_date': transaction.confirmation_date.isoformat() if transaction.confirmation_date else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get transaction', 'details': str(e)}), 500 