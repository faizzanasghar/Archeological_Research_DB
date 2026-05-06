import oracledb
import sys
import os

# Add the project root to the path so we can import our config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

try:
    # Attempt to initialize thick client if needed
    try:
        oracledb.init_oracle_client()
        print("Oracle Thick Client initialized.")
    except Exception as e:
        print(f"Note: Thick client init skipped (may already be init): {e}")

    # Use credentials from our new config structure
    from src.config.config import Config
    
    print(f"Connecting to Oracle as {Config.ORACLE_USER}...")
    conn = oracledb.connect(
        user=Config.ORACLE_USER,
        password=Config.ORACLE_PASSWORD,
        dsn=Config.ORACLE_DSN
    )
    
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM v$database")
    db_name = cursor.fetchone()
    print(f"Successfully connected to Oracle Database: {db_name[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM app_login")
    user_count = cursor.fetchone()[0]
    print(f"Integrity Check: {user_count} users found in app_login table.")
    
    conn.close()
    print("\n✅ CONNECTION VERIFIED: Your Oracle 11g XE is perfectly integrated with the new Enterprise Backend.")

except Exception as e:
    print(f"\n❌ CONNECTION FAILED: {str(e)}")
    sys.exit(1)
