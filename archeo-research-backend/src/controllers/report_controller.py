from flask import jsonify
from sqlalchemy import func
from src.models.models import db, FinancialVoucher, ExcavationSite, AppLogin, SystemAuditLog, Artifact, Layer, Museum


def get_financial_summary():
    vouchers = db.session.query(FinancialVoucher, ExcavationSite, AppLogin).join(
        ExcavationSite, FinancialVoucher.site_id == ExcavationSite.site_id
    ).join(
        AppLogin, FinancialVoucher.created_by == AppLogin.user_id
    ).order_by(FinancialVoucher.voucher_date.desc()).all()

    return jsonify([{
        'voucherId': voucher.voucher_id,
        'siteName': site.site_name if site else 'Unknown',
        'type': voucher.voucher_type,
        'amount': voucher.amount_pkr,
        'date': voucher.voucher_date.strftime('%Y-%m-%d') if voucher.voucher_date else None,
        'status': voucher.status,
        'submittedBy': user.username if user else 'Unknown'
    } for voucher, site, user in vouchers]), 200


def get_audit_logs():
    logs = db.session.query(SystemAuditLog, AppLogin).join(
        AppLogin, SystemAuditLog.user_id == AppLogin.user_id
    ).order_by(SystemAuditLog.action_timestamp.desc()).limit(50).all()

    return jsonify([{
        'logId': log.log_id,
        'time': log.action_timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'user': user.username if user else 'Unknown',
        'action': log.action_type,
        'table': log.table_affected,
        'details': log.details
    } for log, user in logs]), 200


def get_public_archive():
    artifacts = db.session.query(Artifact, Layer, ExcavationSite, Museum).join(
        Layer, Artifact.layer_id == Layer.layer_id
    ).join(
        ExcavationSite, Layer.site_id == ExcavationSite.site_id
    ).join(
        Museum, Artifact.museum_id == Museum.museum_id
    ).order_by(Artifact.artifact_id.desc()).all()

    return jsonify([{
        'artifactId': artifact.artifact_id,
        'material': artifact.material,
        'condition': artifact.condition,
        'siteName': site.site_name if site else 'Unknown',
        'location': site.location if site else None,
        'age': artifact.dating_records[0].record_type if artifact.dating_records else 'Unknown',
        'museum': museum.museum_name if museum else 'Unknown'
    } for artifact, layer, site, museum in artifacts]), 200


def get_analytics_expenditure():
    dialect = db.session.bind.dialect.name if db.session.bind else 'sqlite'
    if dialect == 'sqlite':
        month_expr = func.strftime('%Y-%m', FinancialVoucher.voucher_date)
    else:
        month_expr = func.to_char(FinancialVoucher.voucher_date, 'YYYY-MM')

    results = db.session.query(
        month_expr.label('month'),
        func.sum(FinancialVoucher.amount_pkr).label('total')
    ).filter(FinancialVoucher.status == 'Approved').group_by('month').order_by('month').all()

    return jsonify([{'month': row.month, 'total': float(row.total or 0)} for row in results]), 200


def get_analytics_materials():
    results = db.session.query(Artifact.material, func.count(Artifact.artifact_id).label('count')).group_by(Artifact.material).all()
    return jsonify([{'material': row.material or 'Unknown', 'count': row.count} for row in results]), 200
