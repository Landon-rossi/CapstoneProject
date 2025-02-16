#!/bin/bash
set -e

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

# 3. Remove and recreate the virtual environment.
if [ -d "env" ]; then
    echo "Removing existing 'env'..."
    rm -rf env
fi

echo "Creating new virtual environment..."
$PYTHON_CMD -m venv env

echo "Activating virtual environment..."
source env/bin/activate

# 4. Upgrade build tools.
echo "Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

# 5. Install from requirements.txt.
echo "Installing requirements..."
pip install -r requirements.txt

# 6. Run your Python script.
echo "Running test_python.py..."
python test_python.py
