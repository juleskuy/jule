# Security Policy

## Supported Versions

Currently supported versions of jule bot:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 🔒 DO NOT:
- ❌ Open a public GitHub issue
- ❌ Discuss the vulnerability publicly
- ❌ Share exploit code publicly

### ✅ DO:
1. **Report privately** via GitHub Security Advisory or email
2. **Provide details:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. **Allow time for fix** - We aim to respond within 48 hours

## Security Best Practices

When using jule bot:

### Bot Token Security
- ✅ **NEVER** commit your bot token to GitHub
- ✅ Always use `.env` file for credentials
- ✅ Keep `.env` in `.gitignore`
- ✅ Regenerate token if accidentally exposed
- ✅ Use environment variables in production

### Permission Management
- ✅ Use least privilege principle
- ✅ Don't give Administrator unless necessary
- ✅ Review bot permissions regularly
- ✅ Use role-based access control
- ✅ Test commands with minimal permissions

### Database Security
- ✅ Regular backups of `database/main.json`
- ✅ Validate all user inputs
- ✅ Sanitize data before storage
- ✅ Don't store sensitive user data
- ✅ Use proper file permissions

### Development
- ✅ Keep dependencies updated (`npm audit`)
- ✅ Review code before merging
- ✅ Test security changes thoroughly
- ✅ Use TypeScript for type safety
- ✅ Validate interaction permissions

## Known Security Considerations

### Discord API
- Bot requires **Message Content Intent** (privileged)
- Bot requires **Server Members Intent** (privileged)
- Commands check permissions before execution
- Rate limiting handled by discord.js

### Data Storage
- JSON database stores user IDs, XP, and economy data
- No passwords or sensitive information stored
- Guild-specific data isolation
- Automatic data cleanup not implemented (manual cleanup required)

### Dependencies
All dependencies are regularly updated. Main dependencies:
- `discord.js` - Official Discord library
- `dotenv` - Environment variable management
- `typescript` - Type safety
- `tsx` - TypeScript execution

Run `npm audit` regularly to check for vulnerabilities.

## Security Updates

Security patches will be released as soon as possible after discovery. Update instructions:

```bash
git pull origin main
npm install
npm run build
npm start
```

## Contact

For security concerns, please use GitHub's private security advisory feature or open a discussion.

---

**Remember:** Your bot token is like a password - protect it!
