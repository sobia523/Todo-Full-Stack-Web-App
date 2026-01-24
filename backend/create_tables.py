#!/usr/bin/env python3
"""
Script to create database tables in Neon database
"""

import os
import sys
# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
from src.database.engine import get_engine, create_db_and_tables
from sqlalchemy import inspect

# Load environment variables
load_dotenv()

# Get the database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # If not found, try to read from the .env.example and prompt user
    print("DATABASE_URL not found in environment.")
    print("Please set your Neon database URL in a .env file or as an environment variable.")
    print("\nTo set it temporarily for this script:")
    print("export DATABASE_URL='postgresql://neondb_owner:YOUR_PASSWORD@ep-hidden-violet-ahszr31k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require'")
    exit(1)

print(f"Connecting to database: {DATABASE_URL}")

try:
    # Create engine with the Neon database URL
    engine = get_engine(DATABASE_URL)

    # Create all tables
    print("Creating tables...")
    create_db_and_tables()
    print("Tables created successfully!")

    # Verify tables were created by checking the tables
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\nTables in database: {tables}")

    if 'user' in tables:
        print("- User table: OK")
    if 'task' in tables:
        print("- Task table: OK")

    print("\nDatabase setup completed successfully!")

except Exception as e:
    print(f"Error creating tables: {str(e)}")
    print("\nMake sure:")
    print("1. Your Neon database connection string is correct")
    print("2. You have the necessary permissions")
    print("3. The database is accessible from your network")