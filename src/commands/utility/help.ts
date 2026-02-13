import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View all available commands and features'),
    category: 'utility',
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('📚 jule - Command List')
            .setDescription('Select a category below to view commands!')
            .addFields(
                { name: '🛡️ Moderation', value: 'Server moderation tools', inline: true },
                { name: '💰 Economy', value: 'Earn and manage coins', inline: true },
                { name: '📊 Leveling', value: 'XP and ranking system', inline: true },
                { name: '🎮 Fun', value: 'Entertainment commands', inline: true },
                { name: '🔧 Utility', value: 'Useful tools', inline: true },
                { name: '👑 Admin', value: 'Server configuration', inline: true }
            )
            .setFooter({ text: 'Use the dropdown menu to view commands in each category' })
            .setTimestamp();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help-category')
            .setPlaceholder('Select a category')
            .addOptions([
                {
                    label: 'Moderation',
                    description: 'Server moderation commands',
                    value: 'moderation',
                    emoji: '🛡️',
                },
                {
                    label: 'Economy',
                    description: 'Economy and currency commands',
                    value: 'economy',
                    emoji: '💰',
                },
                {
                    label: 'Leveling',
                    description: 'Level and rank commands',
                    value: 'leveling',
                    emoji: '📊',
                },
                {
                    label: 'Fun',
                    description: 'Fun and entertainment commands',
                    value: 'fun',
                    emoji: '🎮',
                },
                {
                    label: 'Utility',
                    description: 'Utility commands',
                    value: 'utility',
                    emoji: '🔧',
                },
                {
                    label: 'Admin',
                    description: 'Server administration commands',
                    value: 'admin',
                    emoji: '👑',
                },
                {
                    label: 'Features',
                    description: 'Automatic features',
                    value: 'features',
                    emoji: '⚡',
                },
            ]);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 300000, // 5 minutes
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'This menu is not for you!', ephemeral: true });
            }

            const category = i.values[0];
            let categoryEmbed: EmbedBuilder;

            switch (category) {
                case 'moderation':
                    categoryEmbed = new EmbedBuilder()
                        .setColor(0x2b2d31)
                        .setTitle('🛡️ Moderation Commands')
                        .setDescription('Manage your server effectively')
                        .addFields(
                            { name: '`/warn`', value: 'Warn a user with reason tracking', inline: false },
                            { name: '`/kick`', value: 'Kick a member from the server', inline: false },
                            { name: '`/ban`', value: 'Ban a user (with message deletion option)', inline: false },
                            { name: '`/mute`', value: 'Timeout a user for specified duration', inline: false },
                            { name: '`/purge`', value: 'Bulk delete messages (1-100)', inline: false }
                        )
                        .setFooter({ text: 'All moderation commands are logged and tracked' });
                    break;

                case 'economy':
                    categoryEmbed = new EmbedBuilder()
                        .setColor(0x2b2d31)
                        .setTitle('💰 Economy Commands')
                        .setDescription('Earn and manage virtual currency')
                        .addFields(
                            { name: '`/balance`', value: 'Check your or another user\'s balance', inline: false },
                            { name: '`/daily`', value: 'Claim 100 coins daily (24h cooldown)', inline: false },
                            { name: '`/work`', value: 'Work to earn 50-150 coins (1h cooldown)', inline: false }
                        )
                        .setFooter({ text: 'More economy features coming soon!' });
                    break;

                case 'leveling':
                    categoryEmbed = new EmbedBuilder()
                        .setColor(0x2b2d31)
                        .setTitle('📊 Leveling Commands')
                        .setDescription('Track your server activity and progress')
                        .addFields(
                            { name: '`/rank`', value: 'View your or another user\'s rank, level, and XP', inline: false },
                            { name: '`/leaderboard`', value: 'View top 10 most active members', inline: false },
                            { name: '📝 Auto XP', value: 'Earn 15-25 XP per message (1 min cooldown)', inline: false }
                        )
                        .setFooter({ text: '100 XP required per level' });
                    break;

                case 'fun':
                    categoryEmbed = new EmbedBuilder()
                        .setColor(0x2b2d31)
                        .setTitle('🎮 Fun Commands')
                        .setDescription('Entertainment and games')
                        .addFields(
                            { name: '`/8ball`', value: 'Ask the magic 8ball a question', inline: false },
                            { name: '`/coinflip`', value: 'Flip a coin (heads or tails)', inline: false }
                        )
                        .setFooter({ text: 'More fun commands coming soon!' });
                    break;

                case 'utility':
                    categoryEmbed = new EmbedBuilder()
                        .setColor(0x2b2d31)
                        .setTitle('🔧 Utility Commands')
                        .setDescription('Useful information and tools')
                        .addFields(
                            { name: '`/ping`', value: 'Check bot latency and API response time', inline: false },
                            { name: '`/serverinfo`', value: 'View detailed server information', inline: false },
                            { name: '`/userinfo`', value: 'View detailed user information', inline: false },
                            { name: '`/help`', value: 'View this help menu', inline: false },
                            { name: '`/setup-voice`', value: 'Setup Join to Create voice channel', inline: false },
                        );
                    break;

                case 'admin':
                    categoryEmbed = new EmbedBuilder()
                        .setColor(0x2b2d31)
                        .setTitle('👑 Admin Commands')
                        .setDescription('Server configuration (Administrator only)')
                        .addFields(
                            { name: '`/config welcome`', value: 'Set welcome message channel', inline: false },
                            { name: '`/config goodbye`', value: 'Set goodbye message channel', inline: false },
                            { name: '`/config modlog`', value: 'Set moderation log channel', inline: false },
                            { name: '`/config autorole`', value: 'Set auto-role for new members', inline: false },
                            { name: '`/config leveling`', value: 'Enable/disable leveling system', inline: false },
                            { name: '`/config view`', value: 'View current server configuration', inline: false },
                            { name: '`/test welcome`', value: 'Test welcome message', inline: false },
                            { name: '`/test goodbye`', value: 'Test goodbye message', inline: false }
                        )
                        .setFooter({ text: '⚠️ Administrator permission required' });
                    break;

                case 'features':
                    categoryEmbed = new EmbedBuilder()
                        .setColor(0x2b2d31)
                        .setTitle('⚡ Automatic Features')
                        .setDescription('Features that work automatically')
                        .addFields(
                            { name: '👋 Welcome Messages', value: 'Greet new members when they join (configurable)', inline: false },
                            { name: '👋 Goodbye Messages', value: 'Say goodbye when members leave (configurable)', inline: false },
                            { name: '🎭 Auto Role', value: 'Automatically assign roles to new members', inline: false },
                            { name: '📊 XP System', value: 'Earn XP from chatting (15-25 XP/msg, 1min cooldown)', inline: false },
                            { name: '🎉 Level Up Notifications', value: 'Get notified when you level up', inline: false },
                            { name: '📝 Moderation Logging', value: 'Track all moderation actions with case numbers', inline: false }
                        )
                        .setFooter({ text: 'Configure these features using /config commands' });
                    break;

                default:
                    categoryEmbed = embed;
            }

            await i.update({ embeds: [categoryEmbed], components: [row] });
        });

        collector.on('end', () => {
            const disabledRow = new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(selectMenu.setDisabled(true));

            interaction.editReply({ components: [disabledRow] }).catch(() => { });
        });
    },
} as Command;
