# Deploying to Railway

This guide will walk you through deploying your Discord bot to Railway.

## Prerequisites

1. A [Railway account](https://railway.app/) (sign up with GitHub)
2. Your Discord bot token and client ID
3. This repository pushed to GitHub (or ready to deploy from local)

## Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub** (if you haven't already):
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push
   ```

2. **Go to Railway**:
   - Visit [railway.app](https://railway.app/)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment Variables**:
   - In your Railway project, go to the "Variables" tab
   - Add the following variables:
     - `BOT_TOKEN`: Your Discord bot token
     - `CLIENT_ID`: Your Discord application client ID
     - `NODE_ENV`: production

4. **Deploy Commands** (Important!):
   After the first deployment completes, you need to register the slash commands:
   - Go to the "Deployments" tab
   - Click on "..." (three dots) on your service
   - Select "Run Command"
   - Execute: `npm run deploy`
   - This registers all slash commands with Discord

5. **Verify Deployment**:
   - Check the logs in Railway to ensure the bot is running
   - Look for "Ready! Logged in as [Your Bot Name]"
   - Test commands in your Discord server

### Option 2: Deploy from CLI

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize and Deploy**:
   ```bash
   railway init
   railway up
   ```

4. **Set Environment Variables**:
   ```bash
   railway variables set BOT_TOKEN=your_bot_token_here
   railway variables set CLIENT_ID=your_client_id_here
   railway variables set NODE_ENV=production
   ```

5. **Deploy Commands**:
   ```bash
   railway run npm run deploy
   ```

## Important Notes

### Build Configuration
The `railway.json` file is already configured with:
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Auto-restart on failure

### Environment Variables Required
- `BOT_TOKEN`: Your Discord bot token (required)
- `CLIENT_ID`: Your Discord application client ID (required)
- `NODE_ENV`: Set to "production" (optional but recommended)

### Database Persistence
The bot uses a JSON database (`database/main.json`). Railway provides:
- Persistent storage for your data
- Automatic backups
- The database file will persist across deployments

To ensure data persistence:
1. The `database` folder is tracked in git
2. Railway will maintain the file between restarts
3. For production use, consider migrating to a proper database (MongoDB, PostgreSQL)

### First-Time Setup Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables set
- [ ] First deployment completed
- [ ] Slash commands registered (`npm run deploy`)
- [ ] Bot is online in Discord
- [ ] Test basic commands (/ping, /help)

## Monitoring

### Railway Dashboard
Monitor your bot in the Railway dashboard:
- **Logs**: Real-time logs of your bot
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: View deployment history

### Discord Bot Status
Check if your bot is online:
1. Go to your Discord server
2. Check the members list for your bot
3. If offline, check Railway logs for errors

## Troubleshooting

### Bot Not Starting
- Check Railway logs for error messages
- Verify environment variables are set correctly
- Ensure `BOT_TOKEN` is valid

### Commands Not Working
- Run `npm run deploy` to register commands
- Check bot permissions in Discord server
- Verify the bot has required intents enabled

### Build Failures
- Check Railway logs for TypeScript errors
- Ensure all dependencies are in package.json
- Try building locally first: `npm run build`

### Database Issues
- Database file is created automatically on first run
- Check write permissions in Railway logs
- Verify the `database` directory exists

## Updating Your Bot

### Method 1: Push to GitHub
```bash
git add .
git commit -m "Update bot"
git push
```
Railway will automatically detect changes and redeploy.

### Method 2: Railway CLI
```bash
railway up
```

### After Updating Commands
If you added/modified slash commands:
```bash
railway run npm run deploy
```

## Cost

Railway offers:
- **Hobby Plan**: $5/month with $5 credit
- **Pro Plan**: $20/month with $20 credit

Your Discord bot should consume minimal resources:
- Approximately $1-3/month for a small to medium server
- Scales based on usage

## Support

- Railway Docs: [docs.railway.app](https://docs.railway.app/)
- Discord.js Guide: [discordjs.guide](https://discordjs.guide/)
- This bot's issues: Check your GitHub repository

## Next Steps

After successful deployment:
1. Invite bot to your Discord server with proper permissions
2. Test all command categories (admin, moderation, economy, leveling)
3. Configure server settings using `/config` commands
4. Set up welcome/goodbye channels
5. Monitor Railway metrics and logs
