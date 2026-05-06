from flask import Blueprint
from flask_jwt_extended import jwt_required
from src.controllers.report_controller import (
    get_financial_summary, get_audit_logs, get_public_archive,
    get_analytics_expenditure, get_analytics_materials
)
from src.middleware.rbac import role_required, ROLES

report_bp = Blueprint('reports', __name__)

@report_bp.route('/finance', methods=['GET'])
@jwt_required()
@role_required(ROLES['DIRECTOR'])
def financial():
    return get_financial_summary()

@report_bp.route('/audit', methods=['GET'])
@jwt_required()
@role_required(ROLES['ADMIN'])
def audit():
    return get_audit_logs()

@report_bp.route('/archive', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def public():
    return get_public_archive()

@report_bp.route('/analytics/expenditure', methods=['GET'])
@jwt_required()
@role_required(ROLES['DIRECTOR'])
def analytics_expenditure():
    return get_analytics_expenditure()

@report_bp.route('/analytics/materials', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def analytics_materials():
    return get_analytics_materials()
