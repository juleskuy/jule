import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, getLeaderboard, getGuildConfig } from '../../database';

const XP_PER_LEVEL = 100;

export default {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Check your or another user\'s rank and level')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to check rank for')
                .setRequired(false)
        ),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        const config = getGuildConfig(interaction.guildId!);
        if (!config.levelingEnabled) {
            return interaction.reply({ content: '🚫 Leveling system is currently disabled for this server.', ephemeral: true });
        }

        const user = interaction.options.getUser('user') || interaction.user;
        const profile = getUserProfile(interaction.guildId!, user.id);
        const leaderboard = getLeaderboard(interaction.guildId!, 100);
        const rank = leaderboard.findIndex(p => p.userId === user.id) + 1;

        const currentLevelXp = profile.level * XP_PER_LEVEL;
        const nextLevelXp = (profile.level + 1) * XP_PER_LEVEL;
        const xpProgress = profile.xp - currentLevelXp;
        const xpNeeded = nextLevelXp - currentLevelXp;
        const percentage = Math.floor((xpProgress / xpNeeded) * 100);

        // Enhanced progress bar with gradient effect
        const filledBars = Math.floor((xpProgress / xpNeeded) * 20);
        const emptyBars = 20 - filledBars;
        const progressBar = '▰'.repeat(filledBars) + '▱'.repeat(emptyBars);

        // Rank badge based on position
        let rankBadge = '🏅';
        if (rank === 1) rankBadge = '👑';
        else if (rank === 2) rankBadge = '🥈';
        else if (rank === 3) rankBadge = '🥉';
        else if (rank <= 10) rankBadge = '⭐';

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setAuthor({ name: `${user.username}'s Rank Card`, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 256 }))
            .setDescription(`${rankBadge} **Server Rank:** \`#${rank || 'Unranked'}\`\n⭐ **Level:** \`${profile.level}\`\n✨ **Total XP:** \`${profile.xp.toLocaleString()}\``)
            .addFields(
                {
                    name: '📊 Level Progress',
                    value: `\`\`\`${progressBar}\`\`\`\n**${xpProgress.toLocaleString()}** / **${xpNeeded.toLocaleString()}** XP (${percentage}%)`,
                    inline: false
                }
            )
            .setFooter({ text: `Keep chatting to gain XP! • ${user.tag}`, iconURL: interaction.guild?.iconURL() || undefined })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
