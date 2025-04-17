#!/bin/bash
set -e  # Stop script on error

REQUIRED_VERSION="3.10"

# 1. Ensure python3.10 is installed via Homebrew if not found.
if ! command -v python3.10 &>/dev/null; then
    echo "python3.10 not found, installing via Homebrew..."
    brew install python@3.10
fi

PYTHON_CMD=$(command -v python3.10)
echo "Found python3.10 at: $PYTHON_CMD"

# 2. Check the installed version is 3.10.x.
INSTALLED_VERSION=$($PYTHON_CMD --version 2>&1 | awk '{print $2}')
if [[ "$INSTALLED_VERSION" != $REQUIRED_VERSION* ]]; then
    echo "Error: Detected Python version $INSTALLED_VERSION, but $REQUIRED_VERSION is required."
    exit 1
fi
echo "Using Python $INSTALLED_VERSION from $PYTHON_CMD."

# 3. Navigate to the correct model directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 4. Remove and recreate the virtual environment inside the model directory
VENV_DIR="$SCRIPT_DIR/env"
if [ -d "$VENV_DIR" ]; then
    echo "Removing existing virtual environment at $VENV_DIR..."
    rm -rf "$VENV_DIR"
fi

echo "Creating new virtual environment at $VENV_DIR..."
$PYTHON_CMD -m venv "$VENV_DIR"

# 5. Activate the model-specific virtual environment
echo "Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# 6. Upgrade build tools
echo "Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

# 7. Install dependencies from requirements.txt
echo "Installing dependencies..."
pip install -r "$SCRIPT_DIR/requirements.txt"

echo "Installation complete!"
