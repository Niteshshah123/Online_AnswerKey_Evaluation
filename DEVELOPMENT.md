# Development Guide

## Architecture Overview

This project follows **Clean Architecture** principles with a modular structure designed for scalability and maintainability.

### Backend Architecture

```
Request → Route → Controller → Service → Repository → Database
                           ↓
                      Validator
                      Middleware
```

#### 1. Routes (`src/routes/`)
- Define API endpoints
- Handle URL routing
- Apply middleware

#### 2. Controllers (`src/controllers/`)
- Handle HTTP requests/responses
- Validate request format
- Call services
- Return responses

#### 3. Services (`src/services/`)
- Implement business logic
- Orchestrate repositories
- Handle domain logic

#### 4. Repositories (`src/repositories/`)
- Abstract database access
- Use Prisma ORM
- Handle CRUD operations

#### 5. Models (`src/models/`)
- Define data structures
- Database schemas defined in Prisma

#### 6. Middlewares (`src/middlewares/`)
- Authentication
- Error handling
- Request logging
- Validation

#### 7. Utilities (`src/utils/`)
- Helper functions
- Common utilities
- JWT operations
- Password hashing

#### 8. Constants (`src/constants/`)
- HTTP status codes
- Error messages
- Application constants

### Frontend Architecture

```
Router → Page → Components → Services → API
            ↓
         Zustand Store
```

#### 1. Routes (`src/routes/`)
- Define application routes
- Protected route handling
- Route configuration

#### 2. Pages (`src/pages/`)
- Top-level page components
- Fetch initial data
- Orchestrate child components

#### 3. Components (`src/components/`)
- Reusable UI components
- Feature-specific components
- Layout components

#### 4. Services (`src/services/`)
- API calls
- Data transformation
- Service layer

#### 5. Store (`src/store/`)
- Zustand stores for state management
- Auth store
- Dashboard store
- Papers store
- Evaluation store

#### 6. Utils (`src/utils/`)
- Helper functions
- Formatting utilities
- Calculation utilities

#### 7. Constants (`src/constants/`)
- API endpoints
- Status codes
- Route definitions

## Adding New Features

### Adding a New Backend Endpoint

1. **Create the Service** (`src/services/index.js`):
```javascript
export class YourService {
  async getYourData(id) {
    // Business logic
  }
}
```

2. **Create the Controller** (`src/controllers/yourfeature.js`):
```javascript
import { YourService } from '../services/index.js';

const service = new YourService();

export class YourController {
  async getData(req, res) {
    try {
      const data = await service.getYourData(req.params.id);
      sendResponse(res, HTTP_STATUS.OK, data, 'Success');
    } catch (error) {
      sendErrorResponse(res, error.statusCode || 500, error.message);
    }
  }
}
```

3. **Create the Route** (`src/routes/yourfeature.js`):
```javascript
import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { yourController } from '../controllers/yourfeature.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/:id', (req, res) => yourController.getData(req, res));

export default router;
```

4. **Add Route to Server** (`src/index.js`):
```javascript
import yourRoutes from './routes/yourfeature.js';
app.use('/api/your-feature', yourRoutes);
```

### Adding a New Frontend Page

1. **Create the Store** (`src/store/yourfeature.js`):
```javascript
import { create } from 'zustand';

export const useYourStore = create((set) => ({
  data: null,
  isLoading: false,
  fetchData: async () => {
    // Fetch logic
  },
}));
```

2. **Create the Service** (`src/services/index.js`):
```javascript
export const yourService = {
  getData: async (id) => {
    const response = await apiClient.get(`/your-feature/${id}`);
    return response.data;
  },
};
```

3. **Create the Page** (`src/pages/YourFeature.jsx`):
```javascript
import React, { useEffect } from 'react';
import { useYourStore } from '../store/yourfeature.js';

export default function YourFeature() {
  const { data, isLoading, fetchData } = useYourStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <Loader />;

  return (
    <div>
      {/* Your content */}
    </div>
  );
}
```

4. **Add Route** (`src/routes/index.jsx`):
```javascript
{
  path: '/your-feature',
  element: <YourFeature />,
}
```

## Database Operations

### Adding a New Table

1. **Update Prisma Schema** (`prisma/schema.prisma`):
```prisma
model YourModel {
  id        Int     @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("your_models")
}
```

2. **Create Migration**:
```bash
npx prisma migrate dev --name add_your_model
```

3. **Create Repository**:
```javascript
export class YourRepository {
  async findById(id) {
    return prisma.yourModel.findUnique({ where: { id } });
  }

  async create(data) {
    return prisma.yourModel.create({ data });
  }
}
```

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"faculty@college.edu","password":"password123"}'

# Get Dashboard Stats (with token)
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Papers
curl -X GET http://localhost:5000/api/papers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create collection: MarkSheet Evaluation
2. Add requests for each endpoint
3. Set up environment variables for base URL and token
4. Use token from login response in Authorization header

## Code Style Guide

### Backend (Node.js/Express)

```javascript
// Use async/await, not callbacks
async function getUserData(id) {
  const data = await repository.findById(id);
  return data;
}

// Use descriptive variable names
const evaluationScore = marks / maxMarks;

// Group related logic in services
// Keep controllers thin

// Always validate input
const { error, value } = schema.validate(data);

// Handle errors explicitly
if (!resource) {
  throw { statusCode: 404, message: 'Not found' };
}
```

### Frontend (React)

```javascript
// Use functional components
export default function MyComponent() {
  const { data } = useStore();

  useEffect(() => {
    // Side effects
  }, []);

  return <div>{data}</div>;
}

// Destructure props
function Card({ title, description }) {
  return <div>{title}</div>;
}

// Use custom hooks for logic
const { data, isLoading } = useMyHook();

// Separate concerns
// Components for UI, services for API, stores for state
```

## Performance Tips

### Backend
- Use database indexes on frequently queried columns
- Implement pagination for large datasets
- Cache database queries when appropriate
- Use prepared statements (Prisma handles this)

### Frontend
- Use React.memo for expensive components
- Implement code splitting with Vite
- Lazy load routes
- Optimize images and assets
- Use Zustand for efficient state management

## Security Checklist

- [ ] Use environment variables for secrets
- [ ] Validate all inputs
- [ ] Use HTTPS in production
- [ ] Set secure JWT secrets
- [ ] Implement rate limiting
- [ ] Use CORS properly
- [ ] Hash passwords with bcrypt
- [ ] Implement proper error handling

## Deployment

### Backend Deployment

```bash
# Build
npm run build

# Set production environment
NODE_ENV=production

# Use strong JWT secrets
JWT_SECRET=strong_random_secret_here

# Use production database
DATABASE_URL=mysql://prod_user:prod_password@prod_host:3306/prod_db

# Start
npm start
```

### Frontend Deployment

```bash
# Build
npm run build

# Serve the dist folder
# Update VITE_API_URL to production API endpoint
```

## Monitoring and Debugging

### Backend Logging
- Check `logs/` directory for error and combined logs
- Adjust LOG_LEVEL in .env

### Frontend Debugging
- Use browser DevTools (F12)
- Check Network tab for API calls
- Check Console for errors

### Database Debugging
```bash
# View database schema
npx prisma studio

# Check migrations
npx prisma migrate status
```

## Contributing Guidelines

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style guide
3. Test thoroughly
4. Create pull request with description
5. Code review before merging

## Common Issues and Solutions

### Migrations failing
```bash
npm run prisma:reset
```

### Store not updating
- Check if you're using `set` correctly in Zustand
- Verify component is subscribed to store

### API calls failing
- Check JWT token expiration
- Verify CORS configuration
- Check request headers

### PDF viewer not loading
- Verify PDF URL is correct
- Check browser console for errors
- Ensure PDF.js worker is loaded

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
