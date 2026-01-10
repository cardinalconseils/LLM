"""Entry point for running the backend on Railway.

This file should be in the /backend directory since Railway's
rootDirectory is set to /backend.

Version: 0.2.0 - Multi-mode council release
"""
import os
import sys

# Add the current directory to path so relative imports work
# This is needed because Railway copies /backend to /app, losing package structure
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the app directly to avoid uvicorn import issues
from main import app
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
