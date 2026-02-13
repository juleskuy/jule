import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getLeaderboard, getGuildConfig } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the server leaderboard'),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        const config = getGuildConfig(interaction.guildId!);
        if (!config.levelingEnabled) {
            return interaction.reply({ content: '🚫 **Leveling is disabled.**\nAsk an admin to enable it using `/config leveling`.', ephemeral: true });
        }

        const leaderboard = getLeaderboard(interaction.guildId!, 10);

        if (leaderboard.length === 0) {
            return interaction.reply({ content: '📉 **Leaderboard is empty.**\nStart chatting to be the first one here!', ephemeral: true });
        }

        let description = '';
        for (let i = 0; i < leaderboard.length; i++) {
            const profile = leaderboard[i];
            const user = await interaction.client.users.fetch(profile.userId).catch(() => null);
            const username = user ? user.username : 'Unknown User';

            let rankStr = `**#${i + 1}**`;
            if (i === 0) rankStr = '🥇';
            if (i === 1) rankStr = '🥈';
            if (i === 2) rankStr = '🥉';

            description += `${rankStr} **${username}** \n> Level \`${profile.level}\` • \`${profile.xp.toLocaleString()} XP\`\n\n`;
        }

        const embed = new EmbedBuilder()
            .setColor(0x9b59b6) // Purple for "Royal/Rank"
            .setTitle(`🏆 ${interaction.guild?.name} Leaderboard`)
            .setDescription(description)
            .setFooter({ text: 'Top 10 Most Active Members', iconURL: interaction.guild?.iconURL() || undefined })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
