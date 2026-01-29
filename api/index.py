import os
import sys

# Add the root directory to sys.path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.src.main import app

# Vercel expects 'app' to be exposed
# This file acts as the Serverless Function entry point
