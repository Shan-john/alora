@echo off
echo ==============================================
echo        Starting Alora Development Servers
echo ==============================================
echo.

echo [1/2] Starting Alora Backend...
start "Alora Backend" cmd /k "cd alora-backend && npm run dev"

echo [2/2] Starting Alora Frontend...
start "Alora Frontend" cmd /k "cd alora-frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo Please keep those windows open while developing.
echo ==============================================
