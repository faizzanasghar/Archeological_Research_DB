from flask import Blueprint
from flask_jwt_extended import jwt_required
from src.controllers.hr_controller import (
    list_workers, hire_worker, get_worker_stats,
    mark_attendance, list_attendance, terminate_worker
)
from src.middleware.rbac import role_required, ROLES

hr_bp = Blueprint('hr', __name__)

@hr_bp.route('/workers', methods=['GET'])
@jwt_required()
@role_required(ROLES['STAFF'])
def get_workers():
    return list_workers()

@hr_bp.route('/workers', methods=['POST'])
@jwt_required()
@role_required(ROLES['STAFF'])
def hire():
    return hire_worker()

@hr_bp.route('/workers/<int:worker_id>', methods=['DELETE'])
@jwt_required()
@role_required(ROLES['STAFF'])
def terminate(worker_id):
    return terminate_worker(worker_id)

@hr_bp.route('/attendance', methods=['POST'])
@jwt_required()
@role_required(ROLES['STAFF'])
def attendance():
    return mark_attendance()

@hr_bp.route('/attendance', methods=['GET'])
@jwt_required()
@role_required(ROLES['STAFF'])
def get_attendance():
    return list_attendance()

@hr_bp.route('/stats', methods=['GET'])
@jwt_required()
@role_required(ROLES['GUEST'])
def stats():
    return get_worker_stats()
