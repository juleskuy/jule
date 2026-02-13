import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin'),
    category: 'fun',
    async execute(interaction: ChatInputCommandInteraction) {
        // Simulate a slight delay for suspense? Unnecessary for interactions but cool idea. 
        // We'll stick to instant generic reply for responsiveness.

        const isHeads = Math.random() < 0.5;
        const result = isHeads ? 'Heads' : 'Tails';
        const emoji = isHeads ? '🪙' : '🦅'; // Coin vs Eagle/Tails representation
        const color = isHeads ? 0xf1c40f : 0x95a5a6; // Gold vs Silver

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('🪙 Coin Flip Result')
            .setDescription(`The coin spins... and lands on!`)
            .addFields(
                { name: 'Result', value: `# ${emoji} ${result}`, inline: false }
            )
            .setFooter({ text: `Full randomness guaranteed • Jule Casino` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
