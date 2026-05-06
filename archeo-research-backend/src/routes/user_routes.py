from flask import Blueprint
from flask_jwt_extended import jwt_required
from src.controllers.user_controller import list_users, create_user, update_user, delete_user
from src.middleware.rbac import role_required, ROLES

user_bp = Blueprint('users', __name__)

@user_bp.route('', methods=['GET'])
@jwt_required()
@role_required(ROLES['ADMIN'])
def get_all():
    return list_users()

@user_bp.route('', methods=['POST'])
@jwt_required()
@role_required(ROLES['ADMIN'])
def add():
    return create_user()

@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
@role_required(ROLES['ADMIN'])
def edit(user_id):
    return update_user(user_id)

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
@role_required(ROLES['ADMIN'])
def remove(user_id):
    return delete_user(user_id)
