import oracledb
import os
import sys
from dotenv import load_dotenv

load_dotenv()

def run_sql_file(filename):
    conn = oracledb.connect(
        user=os.getenv('ORACLE_USER'),
        password=os.getenv('ORACLE_PASSWORD'),
        dsn=os.getenv('ORACLE_DSN')
    )
    cursor = conn.cursor()
    
    with open(filename, 'r') as f:
        content = f.read()
        
    # Remove comments
    lines = [l for l in content.split('\n') if not l.strip().startswith('--')]
    content = '\n'.join(lines)
    
    # Split by / (for blocks) or ; (for statements)
    # This is still simplified but better
    import re
    statements = re.split(r';|/', content)
    
    for stmt in statements:
        stmt = stmt.strip()
        if not stmt or stmt.upper() in ['EXIT', 'COMMIT']:
            if stmt.upper() == 'COMMIT':
                conn.commit()
            continue
        try:
            cursor.execute(stmt)
            print(f"Executed: {stmt[:50]}...")
        except Exception as e:
            print(f"Error: {e} | SQL: {stmt[:50]}...")
            
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    oracledb.init_oracle_client()
    file_to_run = sys.argv[1] if len(sys.argv) > 1 else 'user_schema.sql'
    run_sql_file(file_to_run)
