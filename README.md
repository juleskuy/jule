# jule - Powerful Discord Bot

A feature-rich Discord bot built with discord.js v14 and TypeScript featuring moderation, economy, leveling, and fun commands with beautiful, premium aesthetics.

## ✨ Features

### 🛡️ Moderation System
- **Warning System** - Track warnings with severity levels and case management
- **User Management** - Kick, ban, and mute members with detailed logging
- **Bulk Actions** - Purge messages with optional user filtering
- **Case Tracking** - Complete moderation history with case IDs

### 💰 Economy System
- **Virtual Currency** - Earn and manage coins with a sophisticated wealth tier system
  - 💎 Diamond (10,000+ coins)
  - 💰 Gold (5,000+ coins)
  - 💸 Silver (1,000+ coins)
  - 💵 Bronze (< 1,000 coins)
- **Daily Rewards** - Claim 100 coins every 24 hours
- **Work System** - Choose from 8 different jobs to earn 50-150 coins per hour
- **Beautiful Embeds** - Color-coded by wealth tier with formatted numbers

### 📊 Leveling System
- **Automatic XP** - Earn 15-25 XP per message with 1-minute cooldown
- **Dynamic Rank Cards** - Beautiful progress bars and rank badges
  - 👑 #1, 🥈 #2, 🥉 #3, ⭐ Top 10
  - Color changes based on level (Gold/Purple/Blue/Gray)
- **Milestone Badges** - Special recognition at key levels
  - 💯 Level 100, 👑 75, 💎 50, 🏆 25, 🥇 10
- **Enhanced Leaderboard** - Visual level bars and formatted stats
- **Level-Up Notifications** - Embedded messages with achievement tracking

### 🎮 Fun Commands
- **Magic 8Ball** - Ask questions and get mystical answers
- **Coin Flip** - Simple heads or tails game

### 🔧 Utility Commands
- **Server Info** - Comprehensive server statistics and information
- **User Info** - Detailed user profiles with join dates and roles
- **Ping** - Check bot latency and API response time
- **Help Menu** - Interactive dropdown menu to browse all commands

### 👑 Administration
- **Server Configuration** - Set up welcome/goodbye channels, auto-roles, and mod logs
- **Testing Tools** - Test welcome and goodbye messages before going live
- **Permission System** - Role-based access control for all admin commands

### ⚡ Automatic Features
- **Welcome Messages** - Greet new members with rich embeds showing member count and account age
- **Goodbye Messages** - Track departures with time-since-joining calculations
- **Auto-Role** - Automatically assign roles to new members
- **Moderation Logging** - Complete audit trail of all moderation actions

## 🎨 Premium Design

All features include:
- ✅ Beautiful, color-coded embeds
- ✅ Dynamic colors based on context (success, error, achievement level)
- ✅ Professional formatting with thousand separators
- ✅ User avatars and server icons
- ✅ Progress bars and visual indicators
- ✅ Contextual footers with tips and stats
- ✅ Milestone recognition and badges
- ✅ Consistent design language across all commands

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- A Discord bot token ([Create one here](https://discord.com/developers/applications))

### Quick Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**

Create `.env` file:
```env
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
```

3. **Enable Privileged Gateway Intents**

Go to [Discord Developer Portal](https://discord.com/developers/applications) → Your App → Bot:
- ✅ Presence Intent
- ✅ Server Members Intent  
- ✅ Message Content Intent

4. **Deploy commands**
```bash
npm run deploy
```

5. **Start the bot**
```bash
npm run dev    # Development with auto-restart
npm start      # Production
```

## 📋 Commands Overview

### Moderation (Administrator/Moderator)
```
/warn @user reason: Spamming           - Warn a user
/kick @user reason: Breaking rules      - Kick a member
/ban @user reason: Severe violation     - Ban a user
/mute @user duration: 60 reason: ...    - Timeout a user
/purge amount: 10 [user: @someone]      - Bulk delete messages
```

### Economy (Everyone)
```
/balance [@user]                        - Check balance
/daily                                  - Claim daily reward (24h cooldown)
/work                                   - Work to earn coins (1h cooldown)
```

### Leveling (Everyone)
```
/rank [@user]                           - View rank card with progress
/leaderboard                            - View top 10 users
```

### Utility (Everyone)
```
/help                                   - Interactive help menu
/ping                                   - Check bot latency
/serverinfo                             - View server information
/userinfo [@user]                       - View user information
```

### Administration (Administrator)
```
/config welcome #channel                - Set welcome channel
/config goodbye #channel                - Set goodbye channel
/config modlog #channel                 - Set moderation log channel
/config autorole @role                  - Set auto-role for new members
/config view                            - View current configuration
/test welcome                           - Test welcome message
/test goodbye                           - Test goodbye message
```

## 🔗 Invite the Bot

Generate an invite link:

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application → OAuth2 → URL Generator
3. Select scopes: `bot` + `applications.commands`
4. Select permissions or use Administrator
5. Use the generated URL

Or use this template:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

## 💾 Database

Uses a simple JSON-based database stored in `database/main.json`:
- ✅ No SQL setup required
- ✅ Automatic file creation
- ✅ Easy to backup and migrate
- ✅ Human-readable format

## 📁 Project Structure

```
jule/
├── src/
│   ├── commands/          # Slash commands by category
│   │   ├── admin/         # Server configuration commands
│   │   ├── economy/       # Currency and rewards
│   │   ├── fun/           # Entertainment commands
│   │   ├── leveling/      # XP and ranking
│   │   ├── moderation/    # Moderation tools
│   │   └── utility/       # Information and tools
│   ├── events/            # Discord event handlers
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Utility functions
│   ├── database/          # Database helpers
│   ├── index.ts           # Main bot file
│   └── deploy-commands.ts # Command registration
├── database/              # JSON data storage
├── AESTHETICS.md          # Design documentation
├── QUICKSTART.md          # Quick setup guide
├── README.md              # This file
├── package.json
└── tsconfig.json
```

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Premium Design** | Beautiful embeds with dynamic colors and badges |
| **Milestone System** | Special recognition at key levels (10, 25, 50, 75, 100) |
| **Wealth Tiers** | 4-tier system with visual badges and colors |
| **Visual Progress** | 20-character progress bars with percentages |
| **Smart Formatting** | Thousand separators, relative timestamps |
| **Rich Embeds** | User avatars, server icons, contextual footers |
| **Case Management** | Complete moderation audit trail |
| **Auto Features** | Welcome/goodbye messages, auto-roles |

## 🚀 Getting Started

Check out [QUICKSTART.md](./QUICKSTART.md) for a detailed step-by-step setup guide!

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Complete setup walkthrough
- **[AESTHETICS.md](./AESTHETICS.md)** - Design system documentation

## 🔧 Configuration

After setup, configure your server:

```
/config welcome #welcome-channel
/config goodbye #goodbye-channel
/config autorole @Member
/config view
```

Test your setup:
```
/test welcome
/test goodbye
```

## 💡 Tips

- **XP Cooldown**: 1 minute between XP gains per user
- **Daily Reset**: 24 hours from last claim
- **Work Cooldown**: 1 hour between work sessions
- **Levels**: 100 XP per level
- **Progress Bars**: 20 characters for precise tracking

## 📊 Current Stats

- **18 Slash Commands** across 6 categories
- **6 Event Handlers** for automatic features
- **Simple JSON Database** for easy management
- **TypeScript** for type safety
- **Discord.js v14** for modern features

## 🌟 What Makes jule Special

1. **Premium Aesthetics** - Every command has beautiful, context-aware embeds
2. **Milestone Recognition** - Special badges and colors for achievements
3. **Wealth Visualization** - Dynamic tiers show economic progress
4. **Smart Cooldowns** - Detailed time remaining displays
5. **Rich Information** - Member counts, timestamps, progress tracking
6. **Consistent Design** - Professional look across all features
7. **Easy to Extend** - Clean code structure for adding features

## 📝 License

MIT License - feel free to use and modify!

---

**Built with ❤️ using discord.js v14 and TypeScript**
