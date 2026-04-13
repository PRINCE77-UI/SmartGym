# Smart GYM - Vercel Deployment Guide

## Overview
This project is configured for full-stack deployment on Vercel:
- **Frontend**: React app deployed to Vercel (https://yourapp.vercel.app)
- **Backend**: Serverless functions (Node.js) deployed to Vercel
- **Database**: MongoDB Atlas (cloud-hosted)

## Project Structure
```
Smart GYM/
├── api/                    # Backend serverless functions
│   ├── auth/              # Authentication endpoints
│   ├── users/             # User endpoints
│   ├── members/           # Members endpoints
│   ├── trainers/          # Trainers endpoints
│   ├── workouts/          # Workouts endpoints
│   ├── config/            # Database config
│   ├── middleware/        # Auth middleware
│   └── models/            # Mongoose schemas
├── frontend/              # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/              # (Legacy - can be archived)
├── .env                  # Environment variables (don't commit)
├── .env.example          # Example env file
└── vercel.json          # Vercel configuration
```

## Prerequisites
1. **MongoDB Atlas Account** - Already set up with connection string
2. **Vercel Account** - Create one at https://vercel.com
3. **Git Repository** - Initialize Git in your project
4. **Node.js** - v16 or higher

## Step 1: Prepare Local Project

### 1.1 Create .env.local for Frontend Development
```bash
cd frontend
echo "REACT_APP_API_BASE_URL=http://localhost:5000" > .env.local
```

### 1.2 Create .env for Backend Development
```bash
cd ..
# .env already exists, verify it contains:
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=your_secret_key
# PORT=5000
```

### 1.3 Test Locally (Optional)
Run backend and frontend separately to verify everything works:
```bash
# Terminal 1: Start serverless functions locally (requires @vercel/node)
cd api
node -e "require('./auth/register.js').default({}, {})"

# Terminal 2: Start frontend
cd frontend
npm install
npm start
```

## Step 2: Initialize Git Repository

```bash
cd /path/to/Smart\ GYM
git init
git add .
git commit -m "Initial commit: Smart GYM with serverless API"
```

## Step 3: Push to GitHub

1. Create a new repository on GitHub (without README)
2. Push your local code:
```bash
git remote add origin https://github.com/yourusername/smart-gym.git
git branch -M main
git push -u origin main
```

## Step 4: Connect to Vercel

### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository (yourusername/smart-gym)
5. Skip framework detection (already configured)
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
7. Click "Deploy"

### Option B: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

During setup, add the environment variables when prompted.

## Step 5: Environment Variables on Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://princekumarsng2005_db_user:Prince@2005databaseatlas@cluster0.po7chqk.mongodb.net/gymapp?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `your_secure_random_key_here` |

⚠️ **Important**: Use environment variables in production, never hardcode secrets!

## Step 6: Update API Endpoints

The frontend automatically uses `/api` endpoints after deployment. For local development:

**For Development (Local):**
```bash
# frontend/.env.local
REACT_APP_API_BASE_URL=http://localhost:5000
```

**For Production (Vercel):**
```bash
# frontend/.env.production
REACT_APP_API_BASE_URL=/api
```

Vercel automatically sets the environment based on NODE_ENV.

## API Routes Available

After deployment, your API endpoints will be:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get authenticated user (requires token)
- `PUT /api/users/profile` - Update user profile (requires token)
- `GET /api/users/[email]` - Get user by email

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create member
- `PUT /api/members/[id]` - Update member
- `DELETE /api/members/[id]` - Delete member

### Trainers
- `GET /api/trainers` - Get all trainers
- `POST /api/trainers` - Create trainer
- `PUT /api/trainers/[id]` - Update trainer
- `DELETE /api/trainers/[id]` - Delete trainer

### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/[id]` - Update workout
- `DELETE /api/workouts/[id]` - Delete workout

## Deployment URL

After deployment, your app will be available at:
```
https://your-project-name.vercel.app
```

API calls automatically route to serverless functions at:
```
https://your-project-name.vercel.app/api/...
```

## Troubleshooting

### Issue: "Cannot find module 'mongoose'"
**Solution**: Mongoose is included in `api/config/db.js`. Ensure all API files import from there.

### Issue: "MONGODB_URI not defined"
**Solution**: Check that environment variables are set in Vercel dashboard and re-deploy:
```bash
git push origin main  # Triggers auto-deployment
```

### Issue: "CORS errors in frontend"
**Solution**: All API routes include CORS headers. Clear browser cache and try again.

### Issue: "Connection timeout"
**Solution**: Check MongoDB Atlas IP whitelist:
1. Go to MongoDB Atlas Dashboard
2. Network Access
3. Add "0.0.0.0/0" (allow all IPs) for Vercel

### Issue: "401 Unauthorized"
**Solution**: Ensure token is being sent in Authorization header:
```javascript
axios.get('/api/users/profile', {
  headers: { Authorization: token }
})
```

## Monitoring & Logs

### View Deployment Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Choose a deployment
5. View logs in "Function logs" section

### Monitor Database
1. Go to MongoDB Atlas Dashboard
2. Check "Metrics" for connection health
3. Review "Activity" for operations

## Next Steps

1. **Custom Domain**: Add your domain in Vercel project settings
2. **SSL Certificate**: Automatically provided by Vercel
3. **Analytics**: Enable in Vercel dashboard
4. **CI/CD**: Auto-deploys on every git push to main
5. **Rollback**: Go to Deployments tab to revert to previous version

## Production Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Environment variables set on Vercel
- [ ] MongoDB Atlas IP whitelist includes Vercel
- [ ] JWT_SECRET is strong (use `openssl rand -base64 32`)
- [ ] Frontend `.env.production` configured
- [ ] API endpoints tested after deployment
- [ ] Error handling configured
- [ ] Monitoring/Alerts set up

## Support

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas/
- **Mongoose Docs**: https://mongoosejs.com/

---

**Last Updated**: April 2026
