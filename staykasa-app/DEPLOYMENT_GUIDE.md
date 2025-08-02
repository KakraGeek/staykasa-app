# StayKasa Deployment Guide

## Database Migration for Vercel Deployment

### Problem
SQLite databases don't work on Vercel's serverless environment because:
- No persistent file storage
- Read-only file system
- Cold starts reset the environment

### Solution: PostgreSQL Database

#### Step 1: Set up PostgreSQL Database

**Option A: Neon (Recommended - Free)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string from the dashboard

**Option B: Supabase (Free)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings > Database

**Option C: Railway (Free)**
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL service
3. Copy the connection string

#### Step 2: Update Environment Variables

**Local Development (.env file):**
```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Vercel Environment Variables:**
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NEXT_PUBLIC_APP_URL`: Your production URL

#### Step 3: Database Migration

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Run Database Migrations:**
```bash
npx prisma db push
```

**Seed the Database (if needed):**
```bash
npm run db:seed
```

#### Step 4: Deploy to Vercel

1. Push your changes to GitHub
2. Vercel will automatically redeploy
3. Check the deployment logs for any errors

### Troubleshooting

**Common Issues:**

1. **"Database connection failed"**
   - Check your DATABASE_URL format
   - Ensure the database is accessible from Vercel's servers
   - Verify your database service is running

2. **"Prisma client not generated"**
   - Run `npx prisma generate` locally
   - Commit the generated files to your repository

3. **"Migration failed"**
   - Check if your database schema is compatible
   - Run `npx prisma db push` to sync schema

### Local Development Setup

**Option 1: Use the same PostgreSQL database**
- Use the same DATABASE_URL for both local and production
- Pros: Consistent environment, easier debugging
- Cons: Shared data between environments

**Option 2: Use SQLite for local development**
- Keep SQLite for local development
- Use PostgreSQL only for production
- Update your .env file to switch between them

### Environment Variables Checklist

Make sure these are set in Vercel:
- [ ] `DATABASE_URL` (PostgreSQL connection string)
- [ ] `JWT_SECRET` (random string for JWT signing)
- [ ] `NEXT_PUBLIC_APP_URL` (your production URL)
- [ ] `EMAIL_USER` (if using email features)
- [ ] `EMAIL_PASSWORD` (if using email features)

### Testing Your Deployment

1. **Check API endpoints**: Visit `/api/properties` to test database connection
2. **Test authentication**: Try logging in with existing accounts
3. **Check admin panel**: Verify admin functionality works
4. **Test property creation**: Ensure hosts can create properties

### Performance Tips

1. **Connection Pooling**: Consider using connection pooling for better performance
2. **Database Indexing**: Add indexes to frequently queried fields
3. **Caching**: Implement caching for frequently accessed data
4. **Monitoring**: Set up database monitoring to track performance 