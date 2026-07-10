#!/bin/bash

echo "=== MarkSheet Evaluation System Setup ==="
echo ""

# Backend Setup
echo "Setting up backend..."
cd backend

# Check if .env exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
  echo "Please edit backend/.env with your MySQL credentials"
fi

echo "Installing backend dependencies..."
npm install

echo "Running Prisma migrations..."
npx prisma migrate dev --name init

echo "Seeding database..."
npm run prisma:seed

cd ..

# Frontend Setup
echo ""
echo "Setting up frontend..."
cd frontend

# Check if .env exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
fi

echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To start the development servers:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Backend API will be available at: http://localhost:5000"
echo ""
echo "Demo Credentials:"
echo "  Email: faculty@college.edu"
echo "  Password: password123"
