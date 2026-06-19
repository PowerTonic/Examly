@echo off
setlocal
rem ====================================================================
rem  Quiz App - start script
rem  Launches the FastAPI backend (port 8000) and the Vite frontend
rem  (port 5173), each in its own window. Performs first-run setup
rem  (Python venv + deps, npm install) if needed.
rem ====================================================================

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

echo.
echo === Quiz App: starting ===
echo.

rem ---- Backend setup ----
if not exist "%BACKEND%\.venv\Scripts\python.exe" (
    echo [backend] Creating virtual environment...
    python -m venv "%BACKEND%\.venv"
    if errorlevel 1 (
        echo [backend] ERROR: failed to create venv. Is Python installed and on PATH?
        pause
        exit /b 1
    )
    echo [backend] Installing dependencies...
    "%BACKEND%\.venv\Scripts\python.exe" -m pip install --upgrade pip
    "%BACKEND%\.venv\Scripts\python.exe" -m pip install -r "%BACKEND%\requirements.txt"
)

rem ---- Frontend setup ----
if not exist "%FRONTEND%\node_modules" (
    echo [frontend] Installing dependencies...
    pushd "%FRONTEND%"
    call npm install
    popd
)

rem ---- Launch servers ----
echo [backend]  http://localhost:8000  (docs at /docs)
start "Quiz Backend" cmd /k "cd /d "%BACKEND%" && .venv\Scripts\python -m uvicorn app.main:app --reload --port 8000"

echo [frontend] http://localhost:5173
start "Quiz Frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev"

echo.
echo === Both servers launched in separate windows. ===
echo === Run stop.bat to shut them down.            ===
echo.
endlocal
