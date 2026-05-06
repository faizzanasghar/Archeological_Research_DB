
import os
import sys

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))

from src import create_app
from src.models.models import AppLogin, db

def check():
    os.environ['DATABASE_URL'] = 'sqlite:///archeo.db'
    app = create_app()
    with app.app_context():
        users = AppLogin.query.all()
        print("Detailed Users in SQLite:")
        for u in users:
            print(f"ID: {u.user_id}, Username: {u.username}, Role: {u.system_role}, Active: {u.is_active}, Password: {u.password_hash}")

if __name__ == "__main__":
    check()
