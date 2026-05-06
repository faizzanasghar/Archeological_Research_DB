from datetime import datetime
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, get_jwt
from sqlalchemy import func
from src.models.models import FinancialVoucher, AppLogin, ExcavationSite, SystemAuditLog, db


def _log_audit(user_id, action_type, table_affected, details):
    audit = SystemAuditLog(
        user_id=user_id,
        action_type=action_type,
        table_affected=table_affected,
        action_timestamp=datetime.utcnow(),
        details=(details or '')[:255]
    )
    db.session.add(audit)


def list_vouchers():
    status = request.args.get('status')
    query = FinancialVoucher.query
    if status:
        query = query.filter_by(status=status)
    vouchers = query.order_by(FinancialVoucher.voucher_date.desc()).all()
    return jsonify([{
        'id': v.voucher_id,
        'siteName': v.site.site_name if v.site else 'Unknown',
        'type': v.voucher_type,
        'amount': v.amount_pkr,
        'status': v.status,
        'date': v.voucher_date.strftime('%Y-%m-%d') if v.voucher_date else None,
        'description': v.description,
        'createdBy': v.created_by
    } for v in vouchers]), 200


def create_voucher():
    data = request.json or {}
    user_id = get_jwt_identity()
    try:
        amount = float(data.get('amount', 0) or 0)
        status = 'Pending_Director_Approval' if amount > 1000000 else 'Pending'
        new_voucher = FinancialVoucher(
            site_id=data.get('siteId'),
            created_by=int(user_id),
            voucher_type=data.get('type'),
            amount_pkr=amount,
            voucher_date=datetime.utcnow(),
            description=data.get('description'),
            status=status
        )
        db.session.add(new_voucher)
        db.session.flush()
        _log_audit(int(user_id), 'CREATE', 'financial_voucher', f"Created voucher {new_voucher.voucher_id} amount={amount}")
        db.session.commit()
        return jsonify({"msg": "Voucher submitted", "id": new_voucher.voucher_id, "status": new_voucher.status}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500


def get_site_budget(site_id):
    budget = db.session.query(func.coalesce(func.sum(FinancialVoucher.amount_pkr), 0)).filter(
        FinancialVoucher.site_id == site_id,
        FinancialVoucher.status == 'Approved'
    ).scalar()
    return jsonify({"siteId": site_id, "totalApprovedBudget": float(budget)}), 200


def approve_voucher(voucher_id):
    try:
        voucher = FinancialVoucher.query.get_or_404(voucher_id)
        claims = get_jwt()
        role = claims.get('role')

        if voucher.status == 'Approved':
            return jsonify({"msg": "Voucher is already approved."}), 200

        if voucher.amount_pkr > 1000000 and role not in ['LeadDirector', 'SuperAdmin', 'DBA']:
            return jsonify({"msg": "High-value vouchers require LeadDirector or higher approval."}), 403

        voucher.status = 'Approved'
        _log_audit(int(get_jwt_identity()), 'APPROVE', 'financial_voucher', f"Approved voucher {voucher_id} status={voucher.status}")
        db.session.commit()
        return jsonify({"msg": f"Voucher {voucher_id} approved"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500
