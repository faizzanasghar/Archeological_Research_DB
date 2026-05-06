from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

# ---------------------------------------------------------
# JUNCTION TABLES (Many-to-Many)
# ---------------------------------------------------------
researcher_artifact = db.Table('researcher_artifact',
    db.Column('researcher_id', db.Integer, db.ForeignKey('researcher.researcher_id'), primary_key=True),
    db.Column('artifact_id', db.Integer, db.ForeignKey('artifact.artifact_id'), primary_key=True)
)

researcher_publication = db.Table('researcher_publication',
    db.Column('researcher_id', db.Integer, db.ForeignKey('researcher.researcher_id'), primary_key=True),
    db.Column('publication_id', db.Integer, db.ForeignKey('publication.publication_id'), primary_key=True)
)

artifact_publication = db.Table('artifact_publication',
    db.Column('artifact_id', db.Integer, db.ForeignKey('artifact.artifact_id'), primary_key=True),
    db.Column('publication_id', db.Integer, db.ForeignKey('publication.publication_id'), primary_key=True)
)

# ---------------------------------------------------------
# SECURITY & AUTHENTICATION
# ---------------------------------------------------------
class AppLogin(db.Model):
    __tablename__ = 'app_login'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    system_role = db.Column(db.String(50), nullable=False)
    accessible_pages = db.Column(db.String(200))
    is_active = db.Column(db.String(1), default='Y')
    
    researcher_profile = db.relationship('Researcher', backref='auth_user', lazy=True)

    def check_password(self, password):
        # Only check hashed passwords - remove plain text support for security
        return check_password_hash(self.password_hash, password)

class SystemAuditLog(db.Model):
    __tablename__ = 'system_audit_log'
    log_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('app_login.user_id'))
    action_type = db.Column(db.String(50))
    table_affected = db.Column(db.String(50))
    action_timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    details = db.Column(db.String(255))

# ---------------------------------------------------------
# CORE ENTITIES
# ---------------------------------------------------------
class Museum(db.Model):
    __tablename__ = 'museum'
    museum_id = db.Column(db.Integer, primary_key=True)
    museum_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    curator_name = db.Column(db.String(100))
    storage_conditions = db.Column(db.String(100))
    
    artifacts = db.relationship('Artifact', backref='museum', lazy=True)

class ExcavationSite(db.Model):
    __tablename__ = 'excavation_site'
    site_id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    location = db.Column(db.String(100))
    discovery_date = db.Column(db.DateTime)
    gps_coordinates = db.Column(db.String(100))
    
    layers = db.relationship('Layer', backref='site', lazy=True)
    vouchers = db.relationship('FinancialVoucher', backref='site', lazy=True)
    workers = db.relationship('SiteWorker', backref='site', lazy=True)
    equipment = db.relationship('EquipmentInventory', backref='site', lazy=True)

class Layer(db.Model):
    __tablename__ = 'layer'
    layer_id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, db.ForeignKey('excavation_site.site_id'), nullable=False)
    layer_name = db.Column(db.String(100))
    soil_type = db.Column(db.String(50))
    depth = db.Column(db.Float)
    estimated_age = db.Column(db.String(50))
    
    artifacts = db.relationship('Artifact', backref='layer', lazy=True)

class Publication(db.Model):
    __tablename__ = 'publication'
    publication_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    publisher = db.Column(db.String(100))
    doi_number = db.Column(db.String(50))
    pub_date = db.Column(db.DateTime)

class Researcher(db.Model):
    __tablename__ = 'researcher'
    researcher_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    affiliation = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('app_login.user_id'), nullable=True)
    
    researcher_type = db.Column(db.String(50)) # For inheritance
    __mapper_args__ = { 'polymorphic_on': researcher_type, 'polymorphic_identity': 'researcher' }

class FieldLead(Researcher):
    __tablename__ = 'field_lead'
    researcher_id = db.Column(db.Integer, db.ForeignKey('researcher.researcher_id'), primary_key=True)
    __mapper_args__ = { 'polymorphic_identity': 'field_lead' }

class LabAnalyst(Researcher):
    __tablename__ = 'lab_analyst'
    researcher_id = db.Column(db.Integer, db.ForeignKey('researcher.researcher_id'), primary_key=True)
    __mapper_args__ = { 'polymorphic_identity': 'lab_analyst' }

# ---------------------------------------------------------
# ARTIFACTS & DATING
# ---------------------------------------------------------
class Artifact(db.Model):
    __tablename__ = 'artifact'
    artifact_id = db.Column(db.Integer, primary_key=True)
    layer_id = db.Column(db.Integer, db.ForeignKey('layer.layer_id'), nullable=False)
    museum_id = db.Column(db.Integer, db.ForeignKey('museum.museum_id'), nullable=False)
    material = db.Column(db.String(50))
    dimensions = db.Column(db.String(50))
    condition = db.Column(db.String(50))
    
    artifact_type = db.Column(db.String(50)) # For inheritance
    __mapper_args__ = { 'polymorphic_on': artifact_type, 'polymorphic_identity': 'artifact' }

    dating_records = db.relationship('DatingRecord', backref='artifact', lazy=True)
    researchers = db.relationship('Researcher', secondary=researcher_artifact, backref='found_artifacts')

class Pottery(Artifact):
    __tablename__ = 'pottery'
    artifact_id = db.Column(db.Integer, db.ForeignKey('artifact.artifact_id'), primary_key=True)
    rim_diameter = db.Column(db.Float)
    glaze_type = db.Column(db.String(50))
    __mapper_args__ = { 'polymorphic_identity': 'pottery' }

class Lithic(Artifact):
    __tablename__ = 'lithic'
    artifact_id = db.Column(db.Integer, db.ForeignKey('artifact.artifact_id'), primary_key=True)
    flaking_technique = db.Column(db.String(50))
    stone_type = db.Column(db.String(50))
    __mapper_args__ = { 'polymorphic_identity': 'lithic' }

class Metal(Artifact):
    __tablename__ = 'metal'
    artifact_id = db.Column(db.Integer, db.ForeignKey('artifact.artifact_id'), primary_key=True)
    corrosion_level = db.Column(db.String(50))
    alloy_composition = db.Column(db.String(100))
    __mapper_args__ = { 'polymorphic_identity': 'metal' }

class DatingRecord(db.Model):
    __tablename__ = 'dating_record'
    record_id = db.Column(db.Integer, primary_key=True)
    artifact_id = db.Column(db.Integer, db.ForeignKey('artifact.artifact_id'), nullable=False)
    date_tested = db.Column(db.DateTime)
    lab_name = db.Column(db.String(100))
    
    record_type = db.Column(db.String(50)) # For inheritance
    __mapper_args__ = { 'polymorphic_on': record_type, 'polymorphic_identity': 'dating_record' }

class CarbonDating(DatingRecord):
    __tablename__ = 'carbon_dating'
    record_id = db.Column(db.Integer, db.ForeignKey('dating_record.record_id'), primary_key=True)
    result_bp = db.Column(db.Integer)
    margin_error = db.Column(db.Integer)
    __mapper_args__ = { 'polymorphic_identity': 'carbon' }

class TreeRingDating(DatingRecord):
    __tablename__ = 'tree_ring_dating'
    record_id = db.Column(db.Integer, db.ForeignKey('dating_record.record_id'), primary_key=True)
    species = db.Column(db.String(50))
    ring_count = db.Column(db.Integer)
    __mapper_args__ = { 'polymorphic_identity': 'tree_ring' }

# ---------------------------------------------------------
# FINANCE & LOGISTICS
# ---------------------------------------------------------
class FinancialVoucher(db.Model):
    __tablename__ = 'financial_voucher'
    voucher_id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, db.ForeignKey('excavation_site.site_id'), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('app_login.user_id'), nullable=False)
    voucher_type = db.Column(db.String(50))
    amount_pkr = db.Column(db.Float, nullable=False)
    voucher_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='Pending')
    description = db.Column(db.String(255))

class SiteWorker(db.Model):
    __tablename__ = 'site_worker'
    worker_id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, db.ForeignKey('excavation_site.site_id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    cnic_number = db.Column(db.String(15), unique=True, nullable=False)
    job_role = db.Column(db.String(50))
    daily_wage_pkr = db.Column(db.Float)
    hire_date = db.Column(db.DateTime)
    
    attendance = db.relationship('WorkerAttendance', backref='worker', lazy=True)

class WorkerAttendance(db.Model):
    __tablename__ = 'worker_attendance'
    attendance_id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('site_worker.worker_id'), nullable=False)
    work_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='Present')

class EquipmentInventory(db.Model):
    __tablename__ = 'equipment_inventory'
    equipment_id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, db.ForeignKey('excavation_site.site_id'), nullable=False)
    item_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    condition = db.Column(db.String(50))
    assigned_to = db.Column(db.Integer, db.ForeignKey('app_login.user_id'))
