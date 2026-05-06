from flask import Blueprint
from flask_jwt_extended import jwt_required
from src.controllers.publication_controller import list_publications, create_publication
from src.middleware.rbac import role_required, ROLES

publication_bp = Blueprint('publications', __name__)

@publication_bp.route('', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def get_all():
    return list_publications()

@publication_bp.route('', methods=['POST'])
@jwt_required()
@role_required(ROLES['RESEARCHER'])
def create():
    return create_publication()
