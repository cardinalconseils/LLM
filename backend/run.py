"""Entry point for running the backend on Railway.

This file should be in the /backend directory since Railway's
rootDirectory is set to /backend.

Version: 0.2.0 - Multi-mode council release
"""
import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    # When rootDirectory is /backend, the module path is just "main:app"
    uvicorn.run("main:app", host="0.0.0.0", port=port)
