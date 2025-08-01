# StayKasa Crush Configuration

## Project Overview
- Multirole platform for direct booking, property co-hosting, and cleaner coordination in Ghana
- Frontend: React (Vite) + Tailwind CSS + ShadCN
- Backend: FastAPI
- Auth: Clerk
- Database: PostgreSQL (Neon or Supabase)
- Storage: Cloudinary
- Payments: Paystack / Flutterwave

## Commands
```bash
# Development
npm run dev          # Start frontend development server
uvicorn main:app --reload  # Start backend development server

# Testing
npm test             # Run all frontend tests
npm test -- --watch  # Run tests in watch mode
python -m pytest     # Run backend tests
python -m pytest -k "test_name"  # Run specific test

# Linting & Formatting
npm run lint         # Lint frontend code
npm run format       # Format frontend code
ruff check .         # Lint Python code
ruff format .        # Format Python code

# Build
npm run build        # Build frontend for production
```

## Code Style
- Follow OWASP Top 10 security practices
- All routes/functions must include error handling
- Use role-based access control (RBAC)
- Keep imports organized and minimal
- Use consistent naming conventions (camelCase for JS/TS, snake_case for Python)
- Remove dead code and unused variables regularly
- Store sensitive keys in environment variables

## Component Guidelines
- Create reusable components with clear purpose
- Use TypeScript for type safety
- Implement proper error boundaries
- Follow established design system (Tailwind + ShadCN)

## Git Workflow
- Commit message format: "action: brief description"
- Example: "add: login component", "fix: booking form validation"