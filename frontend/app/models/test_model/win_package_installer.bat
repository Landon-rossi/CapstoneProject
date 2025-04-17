@echo off
setlocal

:: Target Python version
set REQUIRED_VERSION=3.10

:: 1. Check if "python" is found, and whether it's 3.10.x
echo Checking for Python %REQUIRED_VERSION%...

:: Capture current python version
for /f "tokens=2 delims= " %%A in ('python --version 2^>nul') do set PY_VERSION_FULL=%%A

:: Extract major.minor from version string
for /f "tokens=1,2 delims=." %%A in ("%PY_VERSION_FULL%") do set PY_VERSION_MAJOR_MINOR=%%A.%%B

:: Display detected version
echo Detected Python version: %PY_VERSION_FULL%

:: Check if major.minor match required version
if not "%PY_VERSION_MAJOR_MINOR%"=="%REQUIRED_VERSION%" (
    echo Python %REQUIRED_VERSION% not found. Skipping Chocolatey install to avoid downgrade conflict.
    echo Attempting to continue with existing version %PY_VERSION_MAJOR_MINOR%...
) else (
    echo Python %REQUIRED_VERSION% found. Proceeding...
)

:: 2. Remove and recreate virtual env
if exist env (
    echo Removing existing "env" folder...
    rmdir /S /Q env
)

echo Creating new virtual environment...
python -m venv env
if %ERRORLEVEL% NEQ 0 (
    echo FAILED: Could not create virtual environment.
    exit /b 1
)

echo Activating virtual environment...
call env\Scripts\activate

:: 3. Upgrade pip, setuptools, wheel
echo Upgrading pip, setuptools, wheel...
python -m pip install --upgrade pip setuptools wheel
if %ERRORLEVEL% NEQ 0 (
    echo FAILED: pip/setuptools/wheel upgrade failed.
    exit /b 1
)

:: 4. Install requirements
echo Installing requirements...
python -m pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo FAILED: requirements installation failed.
    exit /b 1
)

echo Install complete.
echo SUCCESS: Model setup finished successfully.
exit /b 0
