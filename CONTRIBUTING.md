# Contributing to jule Bot

First off, thank you for considering contributing to jule Bot! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (commands, screenshots, etc.)
- **Describe the behavior you observed** and what you expected
- **Include your environment details** (Node.js version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List some examples** of how it would work

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our code style
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

## Development Setup

1. Clone your fork
```bash
git clone https://github.com/juleskuy/jule.git
cd jule
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your bot credentials
```

4. Run development mode
```bash
npm run dev
```

## Code Style

- **TypeScript** - All code must be in TypeScript
- **Formatting** - Use consistent indentation (2 spaces)
- **Naming** - Use descriptive variable and function names
- **Comments** - Add comments for complex logic
- **Clean Code** - Follow the principles in our codebase

### File Structure

```
src/
├── commands/          # Organized by category
│   ├── admin/
│   ├── economy/
│   ├── fun/
│   ├── leveling/
│   ├── moderation/
│   └── utility/
├── events/            # Discord event handlers
├── types/             # TypeScript interfaces
├── utils/             # Utility functions
└── database/          # Database helpers
```

## Adding New Commands

1. Create a new file in the appropriate category folder
2. Use this template:

```typescript
import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';

export default {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Command description'),
  category: 'category',
  async execute(interaction) {
    // Your command logic here
    await interaction.reply('Response');
  },
} as Command;
```

3. Follow the aesthetic design patterns (see AESTHETICS.md)
4. Use embeds with proper colors and formatting
5. Add error handling
6. Test thoroughly

## Adding New Events

1. Create a new file in `src/events/`
2. Export an object with `name` and `execute` properties
3. Follow existing event patterns

## Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests liberally

Examples:
- `Add daily streak counter to economy`
- `Fix level-up notification embed color`
- `Update README with new commands`

## Testing

Before submitting:

- ✅ Test all modified commands
- ✅ Check for TypeScript errors (`npm run build`)
- ✅ Verify embeds display correctly
- ✅ Test error cases
- ✅ Ensure no breaking changes

## Questions?

Feel free to open an issue with the `question` label!

---

Thank you for contributing! 🚀
