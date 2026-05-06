from flask import Blueprint
from flask_jwt_extended import jwt_required
from src.controllers.artifact_controller import list_artifacts, create_artifact, list_layers
from src.middleware.rbac import role_required, ROLES

artifact_bp = Blueprint('artifacts', __name__)

@artifact_bp.route('', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def get_all():
    return list_artifacts()

@artifact_bp.route('', methods=['POST'])
@jwt_required()
@role_required(ROLES['RESEARCHER'])
def create():
    return create_artifact()

@artifact_bp.route('/layers/<int:site_id>', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def get_layers(site_id):
    return list_layers(site_id)
