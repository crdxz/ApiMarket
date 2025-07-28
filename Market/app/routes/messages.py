from flask import Blueprint, request, jsonify
from .. import db
from ..models import Message, PurchaseRequest, User

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/<int:request_id>', methods=['GET'])
def get_messages(request_id):
    """Get all messages for a specific purchase request"""
    try:
        # Check if purchase request exists
        purchase_request = PurchaseRequest.query.get_or_404(request_id)
        
        messages = Message.query.filter_by(purchase_request_id=request_id).order_by(Message.timestamp).all()
        
        message_list = []
        for msg in messages:
            message_list.append({
                'id': msg.id,
                'purchase_request_id': msg.purchase_request_id,
                'sender_id': msg.sender_id,
                'receiver_id': msg.receiver_id,
                'message': msg.message,
                'timestamp': msg.timestamp.isoformat() if msg.timestamp else None
            })
        
        return jsonify({'messages': message_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get messages', 'details': str(e)}), 500

@messages_bp.route('/', methods=['POST'])
def create_message():
    """Create a new message"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['purchase_request_id', 'sender_id', 'receiver_id', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if purchase request exists
        purchase_request = PurchaseRequest.query.get(data['purchase_request_id'])
        if not purchase_request:
            return jsonify({'error': 'Purchase request not found'}), 404
        
        # Check if sender exists
        sender = User.query.get(data['sender_id'])
        if not sender:
            return jsonify({'error': 'Sender not found'}), 404
        
        # Check if receiver exists
        receiver = User.query.get(data['receiver_id'])
        if not receiver:
            return jsonify({'error': 'Receiver not found'}), 404
        
        # Create new message
        new_message = Message(
            purchase_request_id=data['purchase_request_id'],
            sender_id=data['sender_id'],
            receiver_id=data['receiver_id'],
            message=data['message']
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        return jsonify({
            'message': 'Message sent successfully',
            'message_data': {
                'id': new_message.id,
                'purchase_request_id': new_message.purchase_request_id,
                'sender_id': new_message.sender_id,
                'receiver_id': new_message.receiver_id,
                'message': new_message.message,
                'timestamp': new_message.timestamp.isoformat() if new_message.timestamp else None
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to send message', 'details': str(e)}), 500

@messages_bp.route('/<int:message_id>', methods=['GET'])
def get_message(message_id):
    """Get a specific message"""
    try:
        message = Message.query.get_or_404(message_id)
        
        return jsonify({
            'id': message.id,
            'purchase_request_id': message.purchase_request_id,
            'sender_id': message.sender_id,
            'receiver_id': message.receiver_id,
            'message': message.message,
            'timestamp': message.timestamp.isoformat() if message.timestamp else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get message', 'details': str(e)}), 500 