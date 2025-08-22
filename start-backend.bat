@echo off
echo Starting HealthSense Backend Server...
echo.
cd backend
echo Installing dependencies...
npm install
echo.
echo Starting server...
node server.js
pause
