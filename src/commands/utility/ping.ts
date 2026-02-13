import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot latency'),
    category: 'utility',
    async execute(interaction) {
        const start = Date.now();
        await interaction.deferReply();
        const latency = Date.now() - start;
        const apiLatency = Math.round(interaction.client.ws.ping);

        let color = 0x2ecc71; // Green
        let status = 'Excellent';

        if (latency > 500) {
            color = 0xe74c3c; // Red
            status = 'High Latency';
        } else if (latency > 200) {
            color = 0xf1c40f; // Yellow
            status = 'Moderate';
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`🏓 Pong! • ${status}`)
            .addFields(
                { name: '📡 Bot Latency', value: `\`${latency}ms\``, inline: true },
                { name: '💻 API Heartbeat', value: `\`${apiLatency}ms\``, inline: true }
            )
            .setFooter({ text: 'Jule Systems', iconURL: interaction.client.user?.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
} as Command;
