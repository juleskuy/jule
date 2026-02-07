import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getLeaderboard } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the server leaderboard'),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        const leaderboard = getLeaderboard(interaction.guildId!, 10);

        if (leaderboard.length === 0) {
            return interaction.reply({ content: '❌ No data available yet! Start chatting to earn XP!', ephemeral: true });
        }

        const description = await Promise.all(
            leaderboard.map(async (profile, index) => {
                const user = await interaction.client.users.fetch(profile.userId).catch(() => null);
                const username = user?.username || 'Unknown User';
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `\`${String(index + 1).padStart(2, '0')}\``;
                const levelBar = '▰'.repeat(Math.min(profile.level, 20));
                return `${medal} **${username}**\n┗━ Level **${profile.level}** • ${profile.xp.toLocaleString()} XP\n${levelBar}`;
            })
        );

        const embed = new EmbedBuilder()
            .setColor(0xffd700)
            .setAuthor({ name: `${interaction.guild?.name} Leaderboard`, iconURL: interaction.guild?.iconURL() || undefined })
            .setDescription(description.join('\n\n'))
            .setFooter({ text: `Keep chatting to climb the ranks! • ${leaderboard.length} users tracked` })
            .setThumbnail(interaction.guild?.iconURL() || '')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
