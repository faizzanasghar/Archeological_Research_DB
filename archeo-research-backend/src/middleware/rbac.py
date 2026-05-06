from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt

# Role permissions inherit upward from less-privileged roles to higher-privileged roles.
ROLE_PERMISSIONS = {
    'SuperAdmin': ['SuperAdmin', 'DBA', 'LeadDirector', 'FieldDirector', 'FieldLabourAdmin', 'SiteAdmin', 'MuseumCurator', 'Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest'],
    'DBA': ['DBA', 'LeadDirector', 'FieldDirector', 'FieldLabourAdmin', 'SiteAdmin', 'MuseumCurator', 'Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest'],
    'LeadDirector': ['LeadDirector', 'FieldDirector', 'FieldLabourAdmin', 'SiteAdmin', 'MuseumCurator', 'Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest'],
    'FieldDirector': ['FieldDirector', 'FieldLabourAdmin', 'SiteAdmin', 'MuseumCurator', 'Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest'],
    'FieldLabourAdmin': ['FieldLabourAdmin', 'SiteAdmin', 'MuseumCurator', 'Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest'],
    'SiteAdmin': ['SiteAdmin', 'MuseumCurator', 'Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest'],
    'MuseumCurator': ['MuseumCurator', 'Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest'],
    'Curator': ['Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest'],
    'Researcher': ['Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest'],
    'LabAnalyst': ['LabAnalyst', 'GuestResearcher', 'Guest'],
    'GuestResearcher': ['GuestResearcher', 'Guest'],
    'Guest': ['Guest']
}

ROLES = {
    'ADMIN': ['SuperAdmin', 'DBA'],
    'DIRECTOR': ['SuperAdmin', 'DBA', 'LeadDirector', 'FieldDirector'],
    'STAFF': ['SuperAdmin', 'DBA', 'LeadDirector', 'FieldDirector', 'FieldLabourAdmin', 'SiteAdmin', 'MuseumCurator', 'Curator'],
    'RESEARCHER': ['SuperAdmin', 'DBA', 'LeadDirector', 'FieldDirector', 'FieldLabourAdmin', 'SiteAdmin', 'MuseumCurator', 'Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher'],
    'GUEST': ['SuperAdmin', 'DBA', 'LeadDirector', 'FieldDirector', 'FieldLabourAdmin', 'SiteAdmin', 'MuseumCurator', 'Curator', 'Researcher', 'LabAnalyst', 'GuestResearcher', 'Guest']
}

def role_required(allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role')

            if not user_role:
                return jsonify({"msg": "Access forbidden: missing role claims"}), 403

            permissions = ROLE_PERMISSIONS.get(user_role, [])
            if not any(role in permissions for role in allowed_roles):
                return jsonify({"msg": "Access forbidden: insufficient permissions"}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper
