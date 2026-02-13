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
            return interaction.reply({ content: '🚫 **Leveling is disabled.**', ephemeral: true });
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

        // Progress Bar Visual
        // Using block characters for a smooth bar
        const totalBars = 15;
        const filledBars = Math.round((percentage / 100) * totalBars);
        const emptyBars = totalBars - filledBars;
        const progressBar = '█'.repeat(filledBars) + '░'.repeat(emptyBars);

        let rankEmoji = '👤';
        if (rank === 1) rankEmoji = '👑';
        else if (rank === 2) rankEmoji = '🥈';
        else if (rank === 3) rankEmoji = '🥉';

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setAuthor({ name: `${user.username}'s Rank Card`, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 256 }))
            .addFields(
                { name: '🏆 Rank', value: `\`#${rank || 'Unranked'}\` ${rankEmoji}`, inline: true },
                { name: '⭐ Level', value: `\`${profile.level}\``, inline: true },
                { name: '✨ Total XP', value: `\`${profile.xp.toLocaleString()}\``, inline: true },
                { name: `📈 Progress to Level ${profile.level + 1}`, value: `\`${progressBar}\` **${percentage}%**\n\`${xpProgress} / ${xpNeeded} XP\``, inline: false }
            )
            .setFooter({ text: 'Jule Leveling System', iconURL: interaction.client.user?.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
