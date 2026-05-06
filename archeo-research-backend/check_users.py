import oracledb
from src.config.config import Config

try:
    oracledb.init_oracle_client()
except:
    pass

try:
    conn = oracledb.connect(user=Config.ORACLE_USER, password=Config.ORACLE_PASSWORD, dsn=Config.ORACLE_DSN)
    cursor = conn.cursor()
    cursor.execute("SELECT user_id, username, password_hash, system_role FROM app_login")
    users = cursor.fetchall()
    print("Users in app_login table:")
    for u in users:
        print(f"ID: {u[0]}, Username: {u[1]}, Password: {u[2]}, Role: {u[3]}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
