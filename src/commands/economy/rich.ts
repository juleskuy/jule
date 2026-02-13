import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getRichList } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('rich')
        .setDescription('View the wealthiest users'),
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const topUsers = getRichList(interaction.guildId!, 10);

        if (topUsers.length === 0) {
            return interaction.reply({ content: '🚫 **No data available yet!** Start earning coins with `/daily` and `/work`.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xffd700) // Gold for leaderboard
            .setTitle('🏆 Top 10 Wealthiest Members')
            .setDescription('Who rules the economy? Here are the richest users!')
            .setFooter({ text: `Total tracked users: ${topUsers.length}` })
            .setTimestamp();

        // Build Leaderboard Content
        let boardContent = '';
        for (let i = 0; i < topUsers.length; i++) {
            const profile = topUsers[i];
            const user = await interaction.client.users.fetch(profile.userId).catch(() => null);
            const username = user ? user.username : 'Hidden User';

            // Medals for top 3
            let rankDisplay = `\`#${i + 1}\``;
            if (i === 0) rankDisplay = '🥇 **#1**';
            if (i === 1) rankDisplay = '🥈 **#2**';
            if (i === 2) rankDisplay = '🥉 **#3**';

            boardContent += `${rankDisplay} — **${username}**\n> 💰 \`${profile.balance.toLocaleString()} coins\`\n\n`;
        }

        embed.setDescription(boardContent);

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
