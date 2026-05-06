# ArcheoDB - Backend API

This is the Flask-based RESTful API for the Archaeological Research Database (ArcheoDB), handling data persistence, authentication, and business logic.

## 🚀 Getting Started

### Prerequisites
- Python 3.12+

### Installation
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install flask flask-sqlalchemy flask-cors flask-jwt-extended
```

### Database Initialization
The application uses SQLite. To seed the database with initial research data and administrative users:
```bash
python seed_data.py
```

### Running the API
```bash
python app.py
```
The API will start at `http://localhost:5000`.

## 🛠️ Core Technologies
- **Flask**: Lightweight web framework for Python.
- **SQLAlchemy**: Powerful Object-Relational Mapper (ORM) for SQLite.
- **Flask-JWT-Extended**: Secure JWT-based authentication and role-based access control.
- **CORS**: Cross-Origin Resource Sharing for frontend communication.

## 📂 API Structure
- `app.py`: Contains API routes and application factory.
- `models.py`: Defines the database schema (Sites, Artifacts, Users, Financials).
- `config.py`: Environment and database configuration.
- `seed_data.py`: Utility script for populating the database.

For comprehensive project documentation, please refer to the [Main README](../README.md).
