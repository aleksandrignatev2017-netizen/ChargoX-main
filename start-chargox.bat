@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is not installed. Opening the download page... & start https://nodejs.org & pause & exit /b)
if not exist node_modules call npm install
start "" http://localhost:3000
call npm run dev
pause
