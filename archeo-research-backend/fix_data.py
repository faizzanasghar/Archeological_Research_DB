from src import create_app
from src.models.models import db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        db.session.execute(text("UPDATE artifact SET artifact_type = 'artifact' WHERE artifact_type IS NULL"))
        db.session.commit()
        print("Successfully updated NULL artifact_type entries.")
    except Exception as e:
        db.session.rollback()
        print(f"Error updating data: {e}")
