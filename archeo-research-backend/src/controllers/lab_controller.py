from flask import jsonify, request
from src.models.models import DatingRecord, CarbonDating, TreeRingDating, db

def list_test_reports():
    records = DatingRecord.query.all()
    return jsonify([{
        'id': r.record_id,
        'artifactId': r.artifact_id,
        'testDate': r.date_tested.strftime('%Y-%m-%d') if r.date_tested else None,
        'lab': r.lab_name,
        'type': r.record_type
    } for r in records]), 200

def create_carbon_report():
    data = request.json
    try:
        # Creating a CarbonDating record (Polymorphic inheritance handles this)
        new_report = CarbonDating(
            artifact_id=data.get('artifactId'),
            date_tested=db.func.current_timestamp(),
            lab_name=data.get('labName'),
            result_bp=data.get('bp'),
            margin_error=data.get('error')
        )
        db.session.add(new_report)
        db.session.commit()
        return jsonify({"msg": "Carbon dating report submitted", "id": new_report.record_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500

def create_tree_ring_report():
    data = request.json
    try:
        new_report = TreeRingDating(
            artifact_id=data.get('artifactId'),
            date_tested=db.func.current_timestamp(),
            lab_name=data.get('labName'),
            species=data.get('species'),
            ring_count=data.get('count')
        )
        db.session.add(new_report)
        db.session.commit()
        return jsonify({"msg": "Tree ring report submitted", "id": new_report.record_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": True, "msg": str(e)}), 500
