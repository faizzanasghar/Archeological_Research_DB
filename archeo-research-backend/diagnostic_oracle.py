import oracledb
import os
from dotenv import load_dotenv

load_dotenv()

def diagnostic():
    try:
        oracledb.init_oracle_client()
        conn = oracledb.connect(
            user=os.getenv('ORACLE_USER'),
            password=os.getenv('ORACLE_PASSWORD'),
            dsn=os.getenv('ORACLE_DSN')
        )
        print(f"--- CONNECTION SUCCESSFUL ---")
        print(f"Connected as: {conn.username}")
        print(f"DSN: {os.getenv('ORACLE_DSN')}")
        print(f"Oracle Version: {conn.version}")
        
        cursor = conn.cursor()
        
        print("\n--- TABLES FOUND ---")
        cursor.execute("SELECT table_name FROM user_tables")
        for row in cursor:
            print(f"Table: {row[0]}")
            
        print("\n--- APP_LOGIN ENTRIES ---")
        cursor.execute("SELECT user_id, username, password_hash, system_role FROM app_login")
        for row in cursor:
            print(f"ID: {row[0]} | User: {row[1]} | Pwd: {row[2]} | Role: {row[3]}")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"CONNECTION FAILED: {e}")

if __name__ == "__main__":
    diagnostic()
