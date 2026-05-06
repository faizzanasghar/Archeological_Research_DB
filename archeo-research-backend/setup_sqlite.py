
import os
import sys

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))

# Use SQLite for local dev - SET THIS BEFORE IMPORTING APP
db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'archeo.db'))
os.environ['DATABASE_URL'] = f'sqlite:///{db_path}'

from src import create_app
from src.models.models import db, AppLogin, Museum, ExcavationSite, Layer, Researcher
from werkzeug.security import generate_password_hash

def setup():
    app = create_app()
    with app.app_context():
        print(f"Active DB URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print("Creating tables in SQLite...")
        db.create_all()
        
        if not AppLogin.query.filter_by(username='admin_dani').first():
            print("Seeding users...")
            users = [
                AppLogin(username='admin_dani', password_hash=generate_password_hash('secure-admin-123'), system_role='SuperAdmin', accessible_pages='ALL'),
                AppLogin(username='lead_taxila', password_hash=generate_password_hash('secure-lead-123'), system_role='LeadDirector', accessible_pages='SITES,FINANCIALS'),
                AppLogin(username='curator_lhr', password_hash=generate_password_hash('secure-curator-123'), system_role='MuseumCurator', accessible_pages='ARTIFACTS'),
                AppLogin(username='guest_std', password_hash=generate_password_hash('secure-guest-123'), system_role='Guest', accessible_pages='DASHBOARD,SITES')
            ]
            db.session.add_all(users)
            
            print("Seeding sites...")
            sites = [
                ExcavationSite(site_name="Mohenjo-Daro", location="Sindh", description="Indus Valley Metropolis", gps_coordinates="27.3291, 68.1389"),
                ExcavationSite(site_name="Taxila", location="Punjab", description="Ancient Gandharan Center", gps_coordinates="33.7460, 72.8258"),
                ExcavationSite(site_name="Harappa", location="Punjab", description="Indus Valley Type Site", gps_coordinates="30.6277, 72.8624")
            ]
            db.session.add_all(sites)
            db.session.commit()
            
            # Add layers for each site
            for site in sites:
                layer = Layer(site_id=site.site_id, layer_name="Foundation Level", soil_type="Clay", depth=3.0, estimated_age="3000 BCE")
                db.session.add(layer)
            
            db.session.commit()
            print("Seeding complete.")
        else:
            print("Database already seeded.")

if __name__ == "__main__":
    setup()
