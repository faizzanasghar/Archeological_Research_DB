from datetime import datetime, timedelta
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from src.models.models import SiteWorker, WorkerAttendance, SystemAuditLog, db


def _log_audit(user_id, action_type, table_affected, details):
    audit = SystemAuditLog(
        user_id=user_id,
        action_type=action_type,
        table_affected=table_affected,
        action_timestamp=datetime.utcnow(),
        details=(details or '')[:255]
    )
    db.session.add(audit)


def list_workers():
    workers = SiteWorker.query.order_by(SiteWorker.full_name).all()
    return jsonify([{
        'id': w.worker_id,
        'name': w.full_name,
        'cnic': w.cnic_number,
        'role': w.job_role,
        'wage': w.daily_wage_pkr,
        'hireDate': w.hire_date.strftime('%Y-%m-%d') if w.hire_date else None,
        'site': w.site.site_name if w.site else 'Unknown'
    } for w in workers]), 200


def hire_worker():
    data = request.json or {}
    user_id = get_jwt_identity()
    try:
        new_worker = SiteWorker(
            site_id=data.get('siteId'),
            full_name=data.get('name'),
            cnic_number=data.get('cnic'),
            job_role=data.get('role'),
            daily_wage_pkr=float(data.get('wage', 0) or 0),
            hire_date=datetime.utcnow()
        )
        db.session.add(new_worker)
        db.session.flush()
        _log_audit(int(user_id), 'CREATE', 'site_worker', f"Hired worker {new_worker.full_name} at site {new_worker.site_id}")
        db.session.commit()
        return jsonify({"msg": "Worker hired successfully", "id": new_worker.worker_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500


def terminate_worker(worker_id):
    user_id = get_jwt_identity()
    try:
        worker = SiteWorker.query.get_or_404(worker_id)
        total_wage = sum(
            w.daily_wage_pkr * (1 if record.status == 'Present' else 0.5)
            for record in worker.attendance
        )
        _log_audit(int(user_id), 'DELETE', 'site_worker', f"Terminated worker {worker.full_name} (ID {worker_id})")
        db.session.delete(worker)
        db.session.commit()
        return jsonify({"msg": "Worker terminated", "finalSettlement": total_wage}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500


def get_worker_stats():
    total_workers = SiteWorker.query.count()
    return jsonify({"totalActiveWorkers": total_workers}), 200


def mark_attendance():
    data = request.json or {}
    worker_id = data.get('workerId')
    status = data.get('status', 'Present')
    valid_status = status if status in ['Present', 'Absent', 'Half-Day'] else 'Present'
    try:
        new_att = WorkerAttendance(
            worker_id=int(worker_id),
            work_date=datetime.utcnow(),
            status=valid_status
        )
        db.session.add(new_att)
        db.session.flush()
        _log_audit(int(get_jwt_identity()), 'CREATE', 'worker_attendance', f"Marked attendance for worker {worker_id} as {valid_status}")
        db.session.commit()
        return jsonify({"msg": "Attendance marked"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500


def list_attendance():
    worker_id = request.args.get('workerId')
    query = WorkerAttendance.query
    if worker_id:
        query = query.filter_by(worker_id=worker_id)
    records = query.order_by(WorkerAttendance.work_date.desc()).all()
    return jsonify([{
        'id': r.attendance_id,
        'worker': r.worker.full_name if r.worker else 'Unknown',
        'date': r.work_date.strftime('%Y-%m-%d'),
        'status': r.status
    } for r in records]), 200
