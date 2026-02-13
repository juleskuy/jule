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
            await interaction.reply({ content: '❌ No data available yet!', ephemeral: true });
            return;
        }

        const description: string[] = [];

        for (let i = 0; i < topUsers.length; i++) {
            const profile = topUsers[i];
            const user = await interaction.client.users.fetch(profile.userId).catch(() => null);
            const username = user ? user.username : 'Unknown User';
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `\`${String(i + 1).padStart(2, '0')}\``;

            description.push(`${medal} **${username}**\n┗━ 💰 \`${profile.balance.toLocaleString()} coins\``);
        }

        const embed = new EmbedBuilder()
            .setColor(0xffd700)
            .setTitle('💎 Richest Users')
            .setDescription(description.join('\n\n'))
            .setFooter({ text: `Top ${topUsers.length} wealthiest members` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
