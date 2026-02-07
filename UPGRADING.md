# Upgrade Guide

This document provides instructions for upgrading between versions of jule bot.

## Current Version: 1.0.0

This is the initial release, so no upgrades are necessary yet.

## Future Upgrades

When new versions are released, this guide will contain:

- **Breaking Changes** - Changes that require action
- **Migration Steps** - How to update your setup
- **Database Changes** - Any database structure updates
- **Configuration Changes** - New or modified settings
- **Deprecated Features** - Features being phased out

## How to Check Your Version

Your current version is listed in `package.json`:

```bash
cat package.json | grep version
```

## Standard Upgrade Process

For most updates:

```bash
# 1. Stop the bot
# Press Ctrl+C in the terminal running the bot

# 2. Backup your data
cp database/main.json database/main.json.backup

# 3. Pull latest changes
git pull origin main

# 4. Install new dependencies
npm install

# 5. Rebuild
npm run build

# 6. Redeploy commands (if needed)
npm run deploy

# 7. Start the bot
npm start
```

## Version History

### v1.0.0 (Current)
- Initial release
- No upgrade needed

---

## Rollback Instructions

If something goes wrong after an upgrade:

```bash
# 1. Stop the bot

# 2. Restore database backup
cp database/main.json.backup database/main.json

# 3. Revert to previous version
git checkout v1.0.0  # Replace with previous version tag

# 4. Reinstall dependencies
npm install

# 5. Rebuild
npm run build

# 6. Start the bot
npm start
```

## Getting Help

If you encounter issues during an upgrade:

1. Check the [CHANGELOG.md](./CHANGELOG.md) for known issues
2. Review [GitHub Issues](https://github.com/juleskuy/jule/issues)
3. Open a new issue with the `upgrade` label

---

**Always backup your database before upgrading!**
