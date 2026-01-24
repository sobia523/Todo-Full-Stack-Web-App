#!/usr/bin/env python3
"""
Script to drop and recreate database tables with correct schema
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
from sqlalchemy import text
from src.database.engine import get_engine
from src.models.user import User
from src.models.task import Task
from sqlmodel import SQLModel

# Load environment variables
load_dotenv()

# Get the database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL not found in environment.")
    exit(1)

print(f"Connecting to database...")

try:
    # Create engine
    engine = get_engine(DATABASE_URL)
    
    # Drop all tables
    print("Dropping existing tables...")
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS task CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS \"user\" CASCADE"))
        conn.commit()
    print("Tables dropped successfully!")
    
    # Create all tables with correct schema
    print("Creating tables with correct schema...")
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully!")
    
    # Verify tables
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\nTables in database: {tables}")
    
    if 'user' in tables:
        columns = [c['name'] for c in inspector.get_columns('user')]
        print(f"User table columns: {columns}")
    
    if 'task' in tables:
        columns = [c['name'] for c in inspector.get_columns('task')]
        print(f"Task table columns: {columns}")
    
    print("\nDatabase setup completed successfully!")

except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()
