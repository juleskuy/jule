import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, ColorResolvable, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';

// Define the category structure for easier management and cleaner code
const CATEGORIES: Record<string, {
    label: string,
    description: string,
    emoji: string,
    embedTitle: string,
    embedDesc: string,
    commands: { name: string, desc: string }[]
}> = {
    moderation: {
        label: 'Moderation',
        description: 'Server moderation tools',
        emoji: '🛡️',
        embedTitle: '🛡️ Moderation System',
        embedDesc: 'Powerful tools to keep your server safe, secure, and organized.',
        commands: [
            { name: '/warn', desc: 'Warn a user with reason tracking' },
            { name: '/kick', desc: 'Kick a member from the server' },
            { name: '/ban', desc: 'Ban a user (with message deletion option)' },
            { name: '/mute', desc: 'Timeout a user for a specified duration' },
            { name: '/purge', desc: 'Bulk delete messages (1-100)' }
        ]
    },
    economy: {
        label: 'Economy',
        description: 'Global economy system',
        emoji: '💰',
        embedTitle: '💰 Global Economy',
        embedDesc: 'Participate in the cross-server economy. Earn, trade, and compete!',
        commands: [
            { name: '/balance', desc: 'Check your current wallet and bank balance' },
            { name: '/daily', desc: 'Claim your daily reward (24h cooldown)' },
            { name: '/work', desc: 'Work a shift to earn coins (Coffee Boosts avail!)' },
            { name: '/pay', desc: 'Transfer coins to another user securely' },
            { name: '/slots', desc: 'Test your luck with the slot machine' },
            { name: '/rob', desc: 'Attempt to rob another user (Shields protect!)' },
            { name: '/rich', desc: 'View the global wealth leaderboard' },
            { name: '/shop', desc: 'Browse the item shop for boosts and flexes' },
            { name: '/buy', desc: 'Purchase items from the shop' },
            { name: '/inventory', desc: 'View your owned items' }
        ]
    },
    leveling: {
        label: 'Leveling',
        description: 'XP and ranking system',
        emoji: '📊',
        embedTitle: '📊 Leveling & Ranks',
        embedDesc: 'Engage with the community to earn XP and level up.',
        commands: [
            { name: '/rank', desc: 'View your current rank card and progress' },
            { name: '/leaderboard', desc: 'See the most active members in the server' },
            { name: '✨ Auto XP', desc: 'Earn 15-25 XP per message (1 min cooldown)' }
        ]
    },
    fun: {
        label: 'Fun',
        description: 'Games and entertainment',
        emoji: '🎮',
        embedTitle: '🎮 Fun & Games',
        embedDesc: 'Take a break and enjoy some entertainment commands.',
        commands: [
            { name: '/rps', desc: 'Play Rock, Paper, Scissors (Solo or PvP)' },
            { name: '/meme', desc: 'View a random meme or tech joke' },
            { name: '/8ball', desc: 'Ask the magic 8ball a question' },
            { name: '/coinflip', desc: 'Flip a coin to settle a debate' }
        ]
    },
    utility: {
        label: 'Utility',
        description: 'Helper tools and info',
        emoji: '🔧',
        embedTitle: '🔧 Utility Tools',
        embedDesc: 'Useful commands for server information and bot diagnostics.',
        commands: [
            { name: '/ping', desc: 'Check the bot\'s latency and heartbeat' },
            { name: '/serverinfo', desc: 'Display detailed server information' },
            { name: '/userinfo', desc: 'Get details about a specific user' },
            { name: '/help', desc: 'Open this interactive help menu' },
            { name: '/setup-voice', desc: 'Configure the Join-to-Create voice system' },
            { name: '/ticket-panel', desc: 'Deploy the customer support ticket panel' }
        ]
    },
    admin: {
        label: 'Admin',
        description: 'Server configuration',
        emoji: '👑',
        embedTitle: '👑 Administration',
        embedDesc: 'Advanced tools for server administrators.',
        commands: [
            { name: '/config welcome', desc: 'Set the welcome messages channel' },
            { name: '/config goodbye', desc: 'Set the goodbye messages channel' },
            { name: '/config modlog', desc: 'Set the moderation logs channel' },
            { name: '/config autorole', desc: 'Set the role given to new members' },
            { name: '/config leveling', desc: 'Toggle the leveling system on/off' },
            { name: '/config ticket-category', desc: 'Set the category for new tickets' },
            { name: '/config ticket-logs', desc: 'Set the channel for ticket transcripts' },
            { name: '/config view', desc: 'View current server configuration' },
            { name: '/test welcome', desc: 'Simulate a welcome message event' },
            { name: '/test goodbye', desc: 'Simulate a goodbye message event' }
        ]
    },
    features: {
        label: 'Features',
        description: 'Auto-running systems',
        emoji: '⚡',
        embedTitle: '⚡ Automated Features',
        embedDesc: 'Passive systems that enhance your server experience.',
        commands: [
            { name: '👋 Welcome Messages', desc: 'Customizable welcome greetings' },
            { name: '👋 Goodbye Messages', desc: 'Customizable leave notifications' },
            { name: '🎭 Auto Role', desc: 'Instant role assignment on join' },
            { name: '📊 XP System', desc: 'Activity tracking and leveling' },
            { name: '🎉 Rank Up', desc: 'Notifications when members level up' },
            { name: '📝 Mod Logging', desc: 'Audit logs for moderation actions' },
            { name: '🎫 Ticket System', desc: 'Private support channels with transcripts' },
            { name: '🔊 VoiceMaster', desc: 'Temporary voice channels with control panel' }
        ]
    }
};

const MAIN_COLOR: ColorResolvable = 0x2b2d31;

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View all available commands and features'),
    category: 'utility',
    async execute(interaction: ChatInputCommandInteraction) {
        // Defer if necessary, but help is usually fast. We'll standard reply.

        const botAvatar = interaction.client.user?.displayAvatarURL();
        const userAvatar = interaction.user.displayAvatarURL();

        // 1. Build the Main Overview Embed
        const mainEmbed = new EmbedBuilder()
            .setColor(MAIN_COLOR)
            .setTitle(`📚 ${interaction.client.user?.username || 'Jule'} Help Center`)
            .setDescription('**Welcome!**\nUse the dropdown menu below to explore the available commands and features.\n\nRequired permissions and cooldowns apply to certain commands.')
            .setThumbnail(botAvatar || null)
            .addFields(
                Object.entries(CATEGORIES).map(([_, cat]) => ({
                    name: `${cat.emoji}  ${cat.label}`,
                    value: `\`${cat.description}\``, // Code block for cleaner look
                    inline: true
                }))
            )
            .setTimestamp()
            .setFooter({ text: 'Use the menu below to navigate', iconURL: botAvatar || undefined });

        // 2. Build the Select Menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help-category')
            .setPlaceholder('Select a category...')
            .addOptions(
                Object.entries(CATEGORIES).map(([key, cat]) => ({
                    label: cat.label,
                    description: cat.description,
                    value: key,
                    emoji: cat.emoji,
                }))
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        // 3. Send the Initial Reply
        const response = await interaction.reply({
            embeds: [mainEmbed],
            components: [row],
            fetchReply: true
        });

        // 4. Create a Collector
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 300_000, // 5 minutes
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: '🚫 This menu is controlled by the command sender.', ephemeral: true });
            }

            const selection = i.values[0];
            const category = CATEGORIES[selection];

            if (category) {
                const categoryEmbed = new EmbedBuilder()
                    .setColor(MAIN_COLOR)
                    .setTitle(`${category.embedTitle}`)
                    .setDescription(`### ${category.embedDesc}\n\n${category.commands.map(cmd => `> **\`${cmd.name}\`**\n> ${cmd.desc}`).join('\n\n')}`)
                    .setThumbnail(botAvatar || null)
                    .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: userAvatar })
                    .setTimestamp();

                await i.update({ embeds: [categoryEmbed], components: [row] });
            }
        });

        collector.on('end', () => {
            const disabledRow = new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(selectMenu.setDisabled(true).setPlaceholder('Menu Expired'));

            interaction.editReply({ components: [disabledRow] }).catch(() => { });
        });
    },
} as Command;
