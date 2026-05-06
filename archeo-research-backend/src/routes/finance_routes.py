from flask import Blueprint
from flask_jwt_extended import jwt_required
from src.controllers.finance_controller import list_vouchers, create_voucher, get_site_budget, approve_voucher
from src.middleware.rbac import role_required, ROLES

finance_bp = Blueprint('finance', __name__)

@finance_bp.route('/vouchers', methods=['GET'])
@jwt_required()
@role_required(ROLES['STAFF'])
def get_vouchers():
    return list_vouchers()

@finance_bp.route('/vouchers', methods=['POST'])
@jwt_required()
@role_required(ROLES['STAFF'])
def add_voucher():
    return create_voucher()

@finance_bp.route('/vouchers/<int:id>/approve', methods=['POST'])
@jwt_required()
@role_required(ROLES['DIRECTOR'])
def approve(id):
    return approve_voucher(id)

@finance_bp.route('/budget/<int:site_id>', methods=['GET'])
@jwt_required()
@role_required(ROLES['DIRECTOR'])
def get_budget(site_id):
    return get_site_budget(site_id)
