import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin'),
    category: 'fun',
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '🔘';

        const embed = new EmbedBuilder()
            .setColor(result === 'Heads' ? 0xffd700 : 0xc0c0c0)
            .setTitle('Coin Flip')
            .setDescription(`${emoji} **${result}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
