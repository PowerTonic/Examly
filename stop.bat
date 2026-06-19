@echo off
setlocal enabledelayedexpansion
rem ====================================================================
rem  Quiz App - stop script
rem  Stops whatever is listening on the backend (8000) and frontend
rem  (5173) ports, then closes the server windows if still open.
rem ====================================================================

echo.
echo === Quiz App: stopping ===
echo.

call :killport 8000 backend
call :killport 5173 frontend

rem ---- Close leftover server windows by title (fallback) ----
taskkill /FI "WINDOWTITLE eq Quiz Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Quiz Frontend*" /T /F >nul 2>&1

echo.
echo === Quiz App stopped. ===
echo.
endlocal
exit /b 0

:killport
set "PORT=%~1"
set "LABEL=%~2"
set "FOUND="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr LISTENING') do (
    set "FOUND=1"
    echo [%LABEL%] stopping PID %%a on port %PORT%
    taskkill /F /PID %%a >nul 2>&1
)
if not defined FOUND echo [%LABEL%] nothing listening on port %PORT%
exit /b 0
