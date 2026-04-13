# MongoDB Atlas Setup Guide for Smart GYM Backend

## Prerequisites
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Node.js installed with npm

## Step 1: Create MongoDB Atlas Account & Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project
4. Build a new cluster (M0 free tier is sufficient for development)
5. Wait for cluster to deploy (5-10 minutes)

## Step 2: Create Database User

1. In Atlas, go to **Database Access**
2. Click **Add New Database User**
3. Choose "Username and Password" authentication
4. Create a username and password (save these securely)
5. Set permissions to "Read and write to any database" or limit to specific databases

## Step 3: Whitelist IP Address

1. Go to **Network Access**
2. Click **Add IP Address**
3. For development: Choose "Allow access from anywhere" or add your IP specifically
4. For production: Add only necessary IPs

## Step 4: Get Connection String

1. In your cluster, click **Connect**
2. Choose **Drivers** (Node.js)
3. Copy the connection string
4. Should look like: `mongodb+srv://username:password@cluster0.mongodb.net/gymapp?retryWrites=true&w=majority`

## Step 5: Setup Environment Variables

1. Create a `.env` file in the backend folder (copy from `.env.example`)
2. Add your MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/gymapp?retryWrites=true&w=majority
   JWT_SECRET=your_secure_random_key_here
   ```
3. **Important**: Keep `.env` file private (never commit to git)

## Step 6: Install Dependencies

```bash
npm install
```

The `dotenv` package is now included and will be automatically installed.

## Step 7: Start the Server

```bash
npm start
```

You should see: `✓ MongoDB Atlas Connected Successfully`

## Connection Pool Configuration

The backend is optimized for a typical gym management system (OLTP workload):

- **maxPoolSize: 50** - Handles peak concurrent requests
- **minPoolSize: 10** - Pre-warmed connections ready
- **maxIdleTimeMS: 600000** - 10 minutes idle timeout
- **connectTimeoutMS: 10000** - 10 seconds connection timeout
- **socketTimeoutMS: 30000** - 30 seconds socket timeout

## Troubleshooting

### "connect ECONNREFUSED"
- Check your IP is whitelisted in Network Access
- Verify connection string is correct
- Ensure credentials are valid

### "authentication failed"
- Double-check username and password in .env file
- Verify database user exists in MongoDB Atlas
- Check user has proper permissions

### "DNS lookup failed"
- Check internet connection
- Verify cluster name in connection string is correct
- Wait if cluster is still deploying

## Database Details

- **Database Name**: gymapp (created automatically on first use)
- **Collections**: Users, Members, Trainers, Workouts (created automatically via schemas)
- **Storage**: 512MB free tier limit (sufficient for initial development)

## Production Considerations

1. Use a strong JWT_SECRET (generate with `openssl rand -base64 32`)
2. Restrict IP access to production servers only
3. Enable encryption at rest (automatic with Atlas)
4. Use M2+ cluster tier for better performance
5. Configure backup and recovery
6. Scale connection pools based on actual traffic

## Upgrading Cluster

If you exceed free tier limits:
1. Go to your cluster settings
2. Select an M2 or higher tier
3. Review pricing and confirm

For more info: [MongoDB Atlas Best Practices](https://docs.mongodb.com/atlas/atlas-best-practices/)
