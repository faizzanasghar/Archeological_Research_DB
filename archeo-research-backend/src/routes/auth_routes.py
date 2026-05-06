from datetime import datetime
from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.controllers.auth_controller import login_user, register_researcher, get_profile
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/connection', methods=['GET'])
def db_diag():
    return {
        "status": "CONNECTED",
        "dsn": os.getenv('ORACLE_DSN') or os.getenv('DATABASE_URL'),
        "user": os.getenv('ORACLE_USER'),
        "timestamp": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    }, 200

@auth_bp.route('/login', methods=['POST'])
def login():
    return login_user()

@auth_bp.route('/register', methods=['POST'])
def register():
    return register_researcher()

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    return get_profile(int(user_id))
