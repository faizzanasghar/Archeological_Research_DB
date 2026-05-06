from flask import Blueprint
from flask_jwt_extended import jwt_required
from src.controllers.site_controller import list_sites, create_site, get_site_details, delete_site
from src.middleware.rbac import role_required, ROLES

site_bp = Blueprint('sites', __name__)

@site_bp.route('', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def get_all():
    return list_sites()

@site_bp.route('', methods=['POST'])
@jwt_required()
@role_required(ROLES['STAFF'])
def create():
    return create_site()

@site_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def get_one(id):
    return get_site_details(id)

@site_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
@role_required(ROLES['DIRECTOR'])
def delete(id):
    return delete_site(id)
