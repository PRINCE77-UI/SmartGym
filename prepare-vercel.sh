#!/bin/bash

# Smart GYM - Quick Vercel Deployment Setup
# This script helps prepare your project for Vercel deployment

echo "🏋️ Smart GYM - Vercel Deployment Setup"
echo "========================================"
echo ""

# Step 1: Initialize Git if not already done
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Smart GYM with serverless API"
    echo "✓ Git initialized"
else
    echo "✓ Git repository already exists"
fi

echo ""

# Step 2: Check for environment files
echo "🔐 Checking environment files..."

if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one with:"
    echo "   MONGODB_URI=your_mongodb_atlas_uri"
    echo "   JWT_SECRET=your_jwt_secret"
else
    echo "✓ .env file exists"
fi

if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating frontend/.env.local..."
    echo "REACT_APP_API_BASE_URL=http://localhost:5000" > frontend/.env.local
    echo "✓ Created frontend/.env.local (for local development)"
fi

echo ""

# Step 3: Display next steps
echo "📝 Next Steps:"
echo "============="
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/yourusername/smart-gym.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   npm install -g vercel"
echo "   vercel --prod"
echo ""
echo "3. Or use Vercel Dashboard:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Click 'New Project'"
echo "   - Import your GitHub repository"
echo "   - Add environment variables"
echo ""
echo "4. Documentation:"
echo "   - See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "✨ Ready for deployment!"
