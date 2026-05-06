from flask import Blueprint
from flask_jwt_extended import jwt_required
from src.controllers.inventory_controller import list_inventory, add_stock, update_stock
from src.middleware.rbac import role_required, ROLES

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def get_all():
    return list_inventory()

@inventory_bp.route('/', methods=['POST'])
@jwt_required()
@role_required(ROLES['STAFF'])
def add():
    return add_stock()

@inventory_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
@role_required(ROLES['STAFF'])
def edit(item_id):
    return update_stock(item_id)
