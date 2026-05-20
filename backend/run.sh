#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PYTHONPATH="$SCRIPT_DIR"
cd "$SCRIPT_DIR/api"
uvicorn main:app --reload --port 8000
