@echo off
REM MarkSheet Evaluation System Setup Script for Windows

echo =========================
echo MarkSheet Evaluation Setup
echo =========================
echo.

REM Backend Setup
echo Setting up backend...
cd backend

REM Check if .env exists
if not exist .env (
  echo Creating .env file...
  copy .env.example .env
  echo Please edit backend\.env with your MySQL credentials
)

echo Installing backend dependencies...
call npm install

echo Running Prisma migrations...
call npx prisma migrate dev --name init

echo Seeding database...
call npm run prisma:seed

cd ..

REM Frontend Setup
echo.
echo Setting up frontend...
cd frontend

REM Check if .env exists
if not exist .env (
  echo Creating .env file...
  copy .env.example .env
)

echo Installing frontend dependencies...
call npm install

cd ..

echo.
echo =========================
echo Setup Complete!
echo =========================
echo.
echo To start the development servers:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
echo Demo Credentials:
echo   Email: faculty@college.edu
echo   Password: password123
echo.
pause
