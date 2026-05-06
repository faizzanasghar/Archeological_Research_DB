from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.models import db
from src.config.config import Config
import oracledb

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    app.url_map.strict_slashes = False
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Initialize Oracle Client only if using Oracle
    if 'oracle' in app.config.get('SQLALCHEMY_DATABASE_URI', '').lower():
        try:
            oracledb.init_oracle_client()
        except Exception as e:
            print(f"Oracle Client already initialized or failed: {e}")
        
    with app.app_context():
        # Register Blueprints
        from src.routes.auth_routes import auth_bp
        from src.routes.site_routes import site_bp
        from src.routes.artifact_routes import artifact_bp
        from src.routes.finance_routes import finance_bp
        from src.routes.hr_routes import hr_bp
        from src.routes.report_routes import report_bp
        from src.routes.user_routes import user_bp
        from src.routes.inventory_routes import inventory_bp
        from src.routes.lab_routes import lab_bp
        from src.routes.publication_routes import publication_bp
        
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(site_bp, url_prefix='/api/sites')
        app.register_blueprint(artifact_bp, url_prefix='/api/artifacts')
        app.register_blueprint(finance_bp, url_prefix='/api/finance')
        app.register_blueprint(hr_bp, url_prefix='/api/hr')
        app.register_blueprint(report_bp, url_prefix='/api/reports')
        app.register_blueprint(user_bp, url_prefix='/api/users')
        app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
        app.register_blueprint(lab_bp, url_prefix='/api/lab')
        app.register_blueprint(publication_bp, url_prefix='/api/publications')
        
    return app
