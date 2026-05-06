from flask import jsonify, request
from src.models.models import AppLogin, db
from werkzeug.security import generate_password_hash

def list_users():
    users = AppLogin.query.all()
    return jsonify([{
        'id': u.user_id,
        'username': u.username,
        'role': u.system_role,
        'isActive': u.is_active,
        'pages': u.accessible_pages
    } for u in users]), 200

def create_user():
    data = request.json
    try:
        if AppLogin.query.filter_by(username=data.get('username')).first():
            return jsonify({"msg": "Username already exists"}), 400
            
        new_user = AppLogin(
            username=data.get('username'),
            password_hash=generate_password_hash(data.get('password')),
            system_role=data.get('role', 'Viewer'),
            is_active='Y'
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "User created", "id": new_user.user_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500

def update_user(user_id):
    try:
        user = AppLogin.query.get_or_404(user_id)
        data = request.json
        
        if 'role' in data:
            user.system_role = data['role']
        if 'isActive' in data:
            user.is_active = data['isActive']
        if 'password' in data and data['password']:
            user.password_hash = generate_password_hash(data['password'])
            
        db.session.commit()
        return jsonify({"msg": "User updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500

def delete_user(user_id):
    try:
        user = AppLogin.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500
