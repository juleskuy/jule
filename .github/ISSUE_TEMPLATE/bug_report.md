---
name: Bug Report
about: Report a bug or issue with the bot
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.
Example: *The /rank command shows incorrect XP values*

## Steps To Reproduce
1. Go to 'any Discord server with the bot'
2. Run command '/rank @user'
3. See error or unexpected behavior

## Expected Behavior
What you expected to happen.
Example: *Should display user's current level and XP with progress bar*

## Actual Behavior
What actually happened.
Example: *Shows NaN for XP values or throws an error*

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- **Node.js Version:** [e.g. 18.17.0]
- **OS:** [e.g. Windows 11, Ubuntu 22.04, macOS]
- **Bot Version:** [e.g. 1.0.0]
- **discord.js Version:** 14.14.1

## Error Messages
```
Paste any error messages from console/terminal here
Example:
TypeError: Cannot read properties of null (reading 'level')
    at execute (rank.ts:25:18)
```

## Command/Feature Affected
- [ ] Moderation (/warn, /kick, /ban, /mute, /purge)
- [ ] Economy (/balance, /daily, /work)
- [ ] Leveling (/rank, /leaderboard, level-ups)
- [ ] Fun (/8ball, /coinflip)
- [ ] Utility (/help, /ping, /serverinfo, /userinfo)
- [ ] Admin (/config, /test)
- [ ] Welcome/Goodbye messages
- [ ] Auto-role
- [ ] Other (specify):

## Additional Context
Add any other context about the problem here.
Example: *This only happens when checking other users' ranks, works fine for own rank*
