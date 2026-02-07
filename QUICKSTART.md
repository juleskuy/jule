# Quick Start Guide for jule Discord Bot

Complete step-by-step setup guide to get your bot running in minutes!

## Step 1: Get Your Bot Token

1. Go to https://discord.com/developers/applications
2. Click **"New Application"** and name it **"jule"**
3. Go to the **"Bot"** tab on the left
4. Click **"Reset Token"** and copy the token (⚠️ keep this secret!)
5. Scroll down and enable these **Privileged Gateway Intents**:
   - ✅ **PRESENCE INTENT**
   - ✅ **SERVER MEMBERS INTENT**
   - ✅ **MESSAGE CONTENT INTENT**
6. Click **Save Changes**

## Step 2: Get Your Client ID

1. In the same application, go to **"General Information"**
2. Copy the **"Application ID"**

## Step 3: Configure the Bot

Edit the `.env` file and paste your credentials:

```env
BOT_TOKEN=paste_your_token_here
CLIENT_ID=paste_your_application_id_here
```

💡 **Tip**: Never share your bot token or commit it to public repositories!

## Step 4: Install Dependencies

Open your terminal in the bot directory and run:

```bash
npm install
```

This will install:
- discord.js v14
- TypeScript
- tsx (for development)
- dotenv (for environment variables)

## Step 5: Deploy Commands

Register all slash commands with Discord:

```bash
npm run deploy
```

You should see:
```
Started refreshing 18 application (/) commands.
✅ Successfully reloaded 18 application (/) commands.
```

## Step 6: Invite the Bot

1. Go back to Discord Developer Portal → **OAuth2** → **URL Generator**
2. Select scopes:
   - ✅ **bot**
   - ✅ **applications.commands**
3. Select permissions:
   - ✅ **Administrator** (for simplicity)
   - Or select individual permissions as needed
4. Copy the generated URL and open it in your browser
5. Select your server and click **Authorize**

## Step 7: Start the Bot

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

You should see:
```
✅ Logged in as jule#1746!
📊 Serving X guilds
```

## Step 8: Configure Your Server

In Discord, use these commands to set up the bot:

### Essential Configuration
```
/config welcome #your-welcome-channel
/config goodbye #your-goodbye-channel
/config autorole @Member
```

### Optional Configuration
```
/config modlog #mod-logs
```

### View Your Settings
```
/config view
```

## Step 9: Test Your Setup

Make sure everything works:

```
/test welcome    # Test welcome message
/test goodbye    # Test goodbye message
/ping           # Check bot latency
/help           # View all commands
```

## 🎮 Try Out the Features!

### Economy System
```
/balance        # Check your balance
/daily          # Claim daily reward (100 coins)
/work           # Work to earn 50-150 coins
```

### Leveling System
```
/rank           # View your rank card with progress bar
/leaderboard    # See top 10 users
```

Send some messages to earn XP automatically!

### Fun Commands
```
/8ball question: Will this bot be awesome?
/coinflip
```

### Server Info
```
/serverinfo     # View server stats
/userinfo       # View your profile
```

### Moderation (requires permissions)
```
/warn @user reason: Breaking rules
/purge amount: 10
```

## 📋 All Available Commands

### 🛡️ Moderation (Requires Permissions)
- `/warn @user reason:` - Issue a warning
- `/kick @user reason:` - Kick a member
- `/ban @user reason:` - Ban a user
- `/mute @user duration:` - Timeout a user (minutes)
- `/purge amount:` - Delete 1-100 messages

### 💰 Economy
- `/balance [@user]` - Check balance
- `/daily` - Claim daily 100 coins (24h cooldown)
- `/work` - Work to earn 50-150 coins (1h cooldown)

### 📊 Leveling
- `/rank [@user]` - View rank card with progress
- `/leaderboard` - Top 10 server members

### 🎮 Fun
- `/8ball question:` - Ask the magic 8ball
- `/coinflip` - Flip a coin

### 🔧 Utility
- `/help` - Interactive command browser
- `/ping` - Check bot latency
- `/serverinfo` - View server information
- `/userinfo [@user]` - View user details

### 👑 Admin (Administrator Only)
- `/config welcome #channel` - Set welcome channel
- `/config goodbye #channel` - Set goodbye channel
- `/config modlog #channel` - Set moderation log channel
- `/config autorole @role` - Set auto-role for new members
- `/config view` - View current settings
- `/test welcome` - Test welcome message
- `/test goodbye` - Test goodbye message

## 🎨 What to Expect

### Beautiful Rank Cards
- Dynamic colors based on level (Gold, Purple, Blue, Gray)
- 20-character progress bars
- Rank badges (👑🥈🥉⭐)
- XP and level tracking

### Economy Features
- Wealth tier badges (💎💰💸💵)
- 8 different job types
- Formatted numbers (1,000 not 1000)
- Cooldown displays with countdown

### Welcome System
- Member count tracking
- Account creation date
- Server icon integration
- Auto-role assignment

### Level-Up Notifications
- Milestone badges (💯👑💎🏆🥇)
- Embedded announcements
- Total XP tracking

## 🔧 Troubleshooting

### Bot doesn't respond
- ✅ Verify all **Privileged Gateway Intents** are enabled
- ✅ Check the bot has permissions in the channel
- ✅ Confirm the token in `.env` is correct
- ✅ Check console for error messages

### Commands don't appear
- ✅ Run `npm run deploy` again
- ✅ Wait 1-2 minutes for Discord to update
- ✅ Try kicking and re-inviting the bot
- ✅ Make sure you selected `applications.commands` scope

### Database errors
- ✅ The `database/` folder will be created automatically
- ✅ Check the bot has write permissions
- ✅ Restart the bot after errors

### XP not working
- ✅ Make sure **Message Content Intent** is enabled
- ✅ Send messages (1 minute cooldown between XP gains)
- ✅ Check console for errors

### Welcome/Goodbye not working
- ✅ Configure channels with `/config welcome #channel`
- ✅ Test with `/test welcome` and `/test goodbye`
- ✅ Ensure bot has permission to send messages in those channels

## 💡 Pro Tips

1. **Use `/help`** - Interactive menu makes discovering features easy
2. **Test features** - Use `/test` commands before announcing to users
3. **Set up channels** - Dedicated channels for different features look professional
4. **Configure auto-role** - Automatically assigns roles to new members
5. **Check logs** - Console shows useful debug information
6. **Backup database** - Copy `database/main.json` regularly

## 📊 System Overview

### How XP Works
- **Earn**: 15-25 XP per message
- **Cooldown**: 1 minute per user
- **Level Up**: Every 100 XP
- **Notifications**: Automatic in the same channel

### Economy System
- **Daily**: 100 coins every 24 hours
- **Work**: 50-150 coins every 1 hour
- **Tiers**: Bronze → Silver → Gold → Diamond

### Database
- **Location**: `database/main.json`
- **Format**: JSON (human-readable)
- **Auto-save**: Changes save immediately
- **Backup**: Just copy the file

## 🚀 Next Steps

- **Customize welcome messages** in `src/events/guildMemberAdd.ts`
- **Adjust XP rates** in `src/events/messageCreate.ts`
- **Modify economy values** in `src/commands/economy/`
- **Add more commands** following the existing structure
- **Check AESTHETICS.md** for design documentation

## 🌟 Features Highlights

✨ **18 commands** across 6 categories  
🎨 **Beautiful embeds** with dynamic colors  
📊 **Progress tracking** with visual bars  
💰 **Wealth tiers** with 4 levels  
🏆 **Milestone badges** for achievements  
👥 **Auto features** for welcome/goodbye  
📝 **Case tracking** for moderation  
🎯 **Simple setup** with JSON database  

---

**Enjoy your bot! 🎉**

For full documentation, see [README.md](./README.md)  
For design details, see [AESTHETICS.md](./AESTHETICS.md)
