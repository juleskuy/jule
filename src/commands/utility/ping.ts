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

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
} as Command;
