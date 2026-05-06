from flask import Blueprint
from flask_jwt_extended import jwt_required
from src.controllers.lab_controller import list_test_reports, create_carbon_report, create_tree_ring_report
from src.middleware.rbac import role_required, ROLES

lab_bp = Blueprint('lab', __name__)

@lab_bp.route('/reports', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def get_reports():
    return list_test_reports()

@lab_bp.route('/reports/carbon', methods=['POST'])
@jwt_required()
@role_required(ROLES['RESEARCHER'])
def add_carbon():
    return create_carbon_report()

@lab_bp.route('/reports/tree-ring', methods=['POST'])
@jwt_required()
@role_required(ROLES['RESEARCHER'])
def add_tree_ring():
    return create_tree_ring_report()
