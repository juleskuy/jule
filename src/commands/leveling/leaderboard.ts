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
            return interaction.reply({ content: '🚫 Leveling system is currently disabled for this server.', ephemeral: true });
        }

        const leaderboard = getLeaderboard(interaction.guildId!, 10);

        if (leaderboard.length === 0) {
            return interaction.reply({ content: '❌ No data available yet! Start chatting to earn XP!', ephemeral: true });
        }

        const description = [];
        for (let i = 0; i < leaderboard.length; i++) {
            const profile = leaderboard[i];
            const user = await interaction.client.users.fetch(profile.userId).catch(() => null);
            const username = user ? user.username : 'Unknown User';
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `\`${String(i + 1).padStart(2, '0')}\``;

            description.push(`${medal} **${username}**\n┗━ Level **${profile.level}** • \`${profile.xp.toLocaleString()} XP\``);
        }

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setAuthor({ name: `${interaction.guild?.name} Leaderboard`, iconURL: interaction.guild?.iconURL() || undefined })
            .setDescription(description.join('\n\n'))
            .setFooter({ text: `Keep chatting to climb the ranks! • ${leaderboard.length} users tracked` })
            .setThumbnail(interaction.guild?.iconURL() || '')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
