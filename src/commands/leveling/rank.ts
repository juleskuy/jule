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

        // --- NEW: Generate Image ---
        try {
            await interaction.deferReply(); // Generating image might take a second

            const { createRankCard } = await import('../../utils/canvas');
            const attachment = await createRankCard({
                user: user,
                level: profile.level,
                currentXp: xpProgress, // XP into current level
                requiredXp: xpNeeded,  // XP needed for next level
                rank: rank,
            });

            await interaction.editReply({ files: [attachment] });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Failed to generate rank card.' });
        }
    },
} as Command;
