# MarkSheet Evaluation System - Setup Guide

## Prerequisites

Before starting, ensure you have:
- Node.js v18 or higher
- npm v9 or higher
- MySQL Server running (v5.7 or higher)

## Quick Start

### Option 1: Automated Setup (Windows)
```bash
# Run the setup script
setup.bat
```

### Option 2: Automated Setup (Linux/Mac)
```bash
# Make script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

### Option 3: Manual Setup

#### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# Change DATABASE_URL to your MySQL connection string
# Example: DATABASE_URL="mysql://root:password@localhost:3306/marksheet_db"

# Install dependencies
npm install

# Run Prisma migrations to create database schema
npx prisma migrate dev --name init

# Seed the database with sample data
npm run prisma:seed

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

#### Step 2: Frontend Setup

In a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Copy environment file (optional, uses default)
cp .env.example .env

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Database Setup

The Prisma schema will automatically create all necessary tables:
- faculties
- students
- courses
- subjects
- exams
- questions
- answer_sheets
- evaluations
- marks

### Reset Database

To reset the database and seed with fresh sample data:

```bash
cd backend
npm run prisma:reset
```

### View Database with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

This opens a browser interface to view and manage your database.

## Demo Credentials

**Email:** faculty@college.edu  
**Password:** password123

These credentials are set up during database seeding.

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000

DATABASE_URL=mysql://username:password@localhost:3306/marksheet_db

JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_change_this
JWT_REFRESH_EXPIRES_IN=30d

CORS_ORIGIN=http://localhost:5173

MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

LOG_LEVEL=debug
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

VITE_APP_NAME=MarkSheet Evaluation System
VITE_APP_VERSION=1.0.0

VITE_ENABLE_DARK_MODE=true
```

## Available Scripts

### Backend

```bash
npm run dev              # Start with hot reload
npm start               # Start production server
npm run prisma:migrate  # Run migrations
npm run prisma:seed     # Seed database
npm run prisma:studio   # Open Prisma Studio
npm run prisma:reset    # Reset and reseed database
npm run lint            # Run ESLint
```

### Frontend

```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

## Project Structure

```
MarkSheet_Evaluation/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Database access
│   │   ├── middlewares/     # Express middlewares
│   │   ├── validators/      # Request validators
│   │   ├── utils/          # Utilities
│   │   ├── constants/      # Constants
│   │   ├── models/         # Data models
│   │   └── index.js        # Express server
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.js         # Seed data
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── store/          # Zustand stores
│   │   ├── services/       # API services
│   │   ├── utils/          # Utilities
│   │   ├── constants/      # Constants
│   │   ├── routes/         # Route config
│   │   ├── styles/         # Global styles
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static files
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── README.md
├── SETUP.md (this file)
├── setup.sh
└── setup.bat
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Faculty login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Papers
- `GET /api/papers` - Get assigned papers (paginated)
- `GET /api/papers?query=value` - Search papers
- `GET /api/papers/:id` - Get paper details

### Evaluation
- `GET /api/evaluations/:answerSheetId` - Get evaluation
- `POST /api/evaluations/:answerSheetId/draft` - Save draft
- `POST /api/evaluations/:answerSheetId/submit` - Submit evaluation

## Troubleshooting

### Database Connection Error

**Error:** `Error connecting to MySQL`

**Solution:**
1. Ensure MySQL is running
2. Check your DATABASE_URL in .env
3. Verify username and password are correct
4. Ensure the database exists or Prisma can create it

```bash
# Test MySQL connection
mysql -u username -p -h localhost
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Backend: Change PORT in .env
2. Frontend: Vite will automatically use 5174 if 5173 is in use

### Node Modules Issues

**Error:** Various module not found errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Prisma Migration Issues

**Error:** Migration errors

**Solution:**
```bash
# Reset database completely
npm run prisma:reset

# If still issues, drop and recreate database manually
# Then run migration
npx prisma migrate dev
```

## Features Implemented

### ✅ Authentication
- JWT-based faculty login
- Secure password hashing with bcrypt
- Token refresh mechanism

### ✅ Dashboard
- Statistics on assigned and completed papers
- Pending papers count
- Completion rate calculation

### ✅ Papers Management
- List assigned papers with pagination
- Search by roll number or student name
- Filter by status
- Quick evaluation access

### ✅ Evaluation System
- Side-by-side PDF viewers
- Independent PDF controls (zoom, rotate, page navigation)
- Question-wise marking
- Real-time mark calculation
- Mark conversion (original to target scale)
- Input validation
- Save as draft
- Submit evaluation
- Read-only after submission

### ✅ User Interface
- Professional, modern design
- Responsive layout
- Tailwind CSS styling
- ShadCN UI components
- Real-time error feedback
- Loading states

## Code Quality

The project follows:
- **Clean Architecture**: Clear separation of concerns
- **SOLID Principles**: Maintainable and scalable code
- **Repository Pattern**: Abstraction of data access
- **Reusable Components**: DRY principle
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation at both layers

## Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- CORS protection
- Input validation
- Error handling without exposing sensitive data
- Secure HTTP headers

## Performance Optimizations

- Query optimization with Prisma
- Pagination for large datasets
- Efficient state management with Zustand
- Code splitting with Vite
- Lazy loading of components

## Future Enhancements

- Admin Portal for managing exams and faculty
- Student Portal for viewing results
- Analytics Dashboard
- OCR integration
- AI-powered evaluation suggestions
- Email notifications
- Audit logging
- Dark mode toggle
- Multi-language support

## Support

For issues or questions, refer to:
- Backend logs: Check terminal output
- Frontend logs: Check browser console (F12)
- Database: Use Prisma Studio (`npm run prisma:studio`)

## License

Created for Amrita Vishwa Vidyapeetham, Chennai Campus.
