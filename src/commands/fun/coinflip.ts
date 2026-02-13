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
            .setColor(0x2b2d31)
            .setTitle('🪙 Coin Flip')
            .setDescription(`The coin landed on:\n# ${emoji} **${result}**`)
            .setFooter({ text: `Flipped by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
