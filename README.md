# Online Answer Sheet Valuation System

A production-quality MVP for digitizing the exam answer sheet evaluation process in colleges. This system allows faculty members to efficiently evaluate student answer sheets using a modern web interface with PDF viewers and an intuitive marking panel.

## Project Overview

This system replaces the manual evaluation process with a digital solution that includes:
- Faculty authentication
- Dashboard with evaluation statistics
- Assigned papers listing
- Side-by-side PDF viewers (Student Answer Sheet & Official Answer Key)
- Intuitive evaluation panel with real-time mark calculation
- Draft saving and submission functionality
- Mark conversion from original to target scale

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: Zustand
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query
- **PDF Viewing**: React PDF (pdf.js)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi

### Database
- MySQL with Prisma ORM for type-safe database access

## Project Structure

```
MarkSheet_Evaluation/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Database access layer
│   │   ├── middlewares/     # Express middlewares
│   │   ├── validators/      # Request validation
│   │   ├── utils/          # Utility functions
│   │   ├── constants/      # Application constants
│   │   └── models/         # Data models
│   ├── prisma/             # Prisma schema and migrations
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/     # Reusable UI components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── pdf/        # PDF viewer components
│   │   │   ├── evaluation/ # Evaluation panel components
│   │   │   └── dashboard/  # Dashboard components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand stores
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── constants/      # Constants
│   │   ├── routes/         # Routing configuration
│   │   ├── assets/         # Static assets
│   │   └── styles/         # Global styles
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL Server

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your MySQL database in `.env`:
```
DATABASE_URL="mysql://username:password@localhost:3306/marksheet_db"
```

5. Run Prisma migrations:
```bash
npx prisma migrate dev
```

6. Seed the database (optional):
```bash
npx prisma db seed
```

7. Start the backend server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure the API endpoint in `.env`:
```
VITE_API_URL="http://localhost:5000/api"
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

### 1. Authentication
- Secure JWT-based faculty login
- Password hashing with bcrypt
- Automatic token refresh

### 2. Dashboard
- Faculty profile information
- Statistics on assigned and completed papers
- Search functionality
- Filter options

### 3. Assigned Papers
- Table view of all assigned papers
- Columns: Roll Number, Student Name, Subject, Status
- Quick evaluation access

### 4. Evaluation Interface
- Three-column layout
- Left: Student Answer Sheet PDF with controls (zoom, rotate, page navigation)
- Center: Official Answer Key PDF with independent controls
- Right: Evaluation Panel with question-wise marking

### 5. Question Marking
- Question cards with:
  - Question number
  - Maximum marks
  - Obtained marks input field
  - Real-time validation
- Automatic total calculation

### 6. Mark Conversion
- Display both original marks and converted marks
- Formula: (Obtained / Original Total) × Target Marks
- Real-time conversion display

### 7. Draft & Submission
- Save progress as draft
- Submit evaluation for finalization
- Read-only view after submission

## Available Scripts

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run prisma:migrate  # Run database migrations
npm run prisma:seed     # Seed database with sample data
npm run prisma:studio   # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Database Schema

The system includes the following main entities:
- **Faculty**: Faculty members who evaluate papers
- **Student**: Students who write exams
- **Course**: Academic courses
- **Subject**: Course subjects
- **Exam**: Exam instances
- **Question**: Questions in exams
- **AnswerSheet**: Student's scanned answer sheets
- **AnswerKey**: Official answer keys
- **Evaluation**: Evaluation records with marks
- **Marks**: Individual question marks

## API Endpoints

### Authentication
- `POST /api/auth/login` - Faculty login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Papers
- `GET /api/papers` - Get assigned papers
- `GET /api/papers/:id` - Get paper details
- `GET /api/papers/:id/answer-sheet` - Get answer sheet PDF
- `GET /api/papers/:id/answer-key` - Get answer key PDF

### Evaluation
- `GET /api/evaluations/:paperId` - Get evaluation details
- `POST /api/evaluations/:paperId/draft` - Save draft
- `POST /api/evaluations/:paperId/submit` - Submit evaluation
- `GET /api/evaluations/:paperId/questions` - Get questions

## Code Quality

This project follows:
- **Clean Architecture**: Clear separation of concerns
- **SOLID Principles**: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
- **Repository Pattern**: Abstraction of data access
- **Reusable Components**: DRY (Don't Repeat Yourself) principle
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Validation**: Input validation at both frontend and backend

## Development Guidelines

### Backend
- Use services for business logic
- Use repositories for database operations
- Validate all inputs using validators
- Follow RESTful API conventions
- Use middleware for cross-cutting concerns

### Frontend
- Create reusable components
- Use custom hooks for logic
- Manage state with Zustand
- Use services for API calls
- Follow React best practices

## Future Enhancements

The architecture supports adding:
- Admin Portal for managing exams and faculty
- Student Portal for viewing results
- Analytics Dashboard with evaluation insights
- OCR integration for automatic question detection
- AI-powered evaluation suggestions
- Email notifications
- Audit logging

## License

This project is created for Amrita Vishwa Vidyapeetham, Chennai Campus.

## Support

For issues or questions, please contact the development team.
