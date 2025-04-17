@echo off
setlocal

:: Target Python version
set REQUIRED_VERSION=3.10

:: 1. Check if "python" is found, and whether it's 3.10.x
python --version 2>nul | findstr /i "%REQUIRED_VERSION%"
if %ERRORLEVEL% NEQ 0 (
    echo Python %REQUIRED_VERSION% not found. Installing via Chocolatey...
    :: Assumes you already have Chocolatey installed
    choco install python --version=3.10.0 -y
)

:: Verify again after attempted install
python --version 2>nul | findstr /i "%REQUIRED_VERSION%"
if %ERRORLEVEL% NEQ 0 (
    echo "Error: Unable to confirm Python %REQUIRED_VERSION% installation."
    exit /b 1
)

echo Found Python %REQUIRED_VERSION%. Proceeding...

:: 2. Remove and recreate virtual env
if exist env (
    echo Removing existing "env" folder...
    rmdir /S /Q env
)

echo Creating new virtual environment...
python -m venv env

echo Activating virtual environment...
call env\Scripts\activate

:: 3. Upgrade pip, setuptools, wheel
echo Upgrading pip, setuptools, wheel...
python -m pip install --upgrade pip setuptools wheel

:: 4. Install requirements
echo Installing requirements...
python -m pip install -r requirements.txt

echo Install complete.
