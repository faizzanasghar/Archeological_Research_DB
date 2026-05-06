from datetime import datetime
from flask import jsonify, request
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash
from src.models.models import AppLogin, Researcher, SystemAuditLog, db


def _log_audit(user_id, action_type, table_affected, details):
    audit = SystemAuditLog(
        user_id=user_id,
        action_type=action_type,
        table_affected=table_affected,
        action_timestamp=datetime.utcnow(),
        details=(details or '')[:255]
    )
    db.session.add(audit)


def login_user():
    data = request.json or {}
    username = (data.get('username') or '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({"msg": "Username and password are required."}), 401

    try:
        user = AppLogin.query.filter_by(username=username, is_active='Y').first()
        if not user or not user.check_password(password):
            return jsonify({"msg": "Invalid username or password."}), 401

        access_token = create_access_token(
            identity=str(user.user_id),
            additional_claims={
                'role': user.system_role,
                'username': user.username,
                'accessiblePages': user.accessible_pages or ''
            }
        )

        _log_audit(user.user_id, 'LOGIN', 'app_login', f"User logged in: {username}")
        db.session.commit()

        return jsonify({
            'token': access_token,
            'user': {
                'id': user.user_id,
                'username': user.username,
                'role': user.system_role,
                'accessiblePages': user.accessible_pages or ''
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Internal server error", "error": str(e)}), 500


def register_researcher():
    data = request.json or {}
    username = (data.get('username') or '').strip()
    password = data.get('password', '')
    name = (data.get('name') or '').strip()
    affiliation = (data.get('affiliation') or '').strip()

    if not username or not password or not name or not affiliation:
        return jsonify({"msg": "Name, affiliation, username, and password are required."}), 400

    if AppLogin.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists."}), 400

    try:
        new_login = AppLogin(
            username=username,
            password_hash=generate_password_hash(password),
            system_role='GuestResearcher',
            accessible_pages='DASHBOARD,SITES,ARTIFACTS,LAB',
            is_active='Y'
        )
        db.session.add(new_login)
        db.session.flush()

        new_researcher = Researcher(
            name=name,
            affiliation=affiliation,
            researcher_type='researcher',
            user_id=new_login.user_id
        )
        db.session.add(new_researcher)

        _log_audit(new_login.user_id, 'REGISTER', 'researcher', f"New researcher created: {username}")
        db.session.commit()

        return jsonify({
            "msg": "Registration successful.",
            "user_id": new_login.user_id,
            "researcher_id": new_researcher.researcher_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Unable to complete registration.", "error": str(e)}), 500


def get_profile(user_id):
    user = AppLogin.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found."}), 404

    return jsonify({
        'id': user.user_id,
        'username': user.username,
        'role': user.system_role,
        'accessiblePages': user.accessible_pages or '',
        'isActive': user.is_active == 'Y'
    }), 200
