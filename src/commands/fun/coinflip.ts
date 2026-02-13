import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin to settle a score!'),
    category: 'fun',
    async execute(interaction: ChatInputCommandInteraction) {
        // Initial "Flipping" state
        await interaction.deferReply();

        const embedFlipping = new EmbedBuilder()
            .setColor(0x95a5a6)
            .setTitle('🪙 Flipping the coin...')
            .setDescription('The coin is in the air! Watch it spin...')
            .setImage('https://media.tenor.com/ImgNqB2qQ4AAAAAC/toss-coin-flip.gif'); // Generic coin flip gif if available/safe, or just text. Using text focus for safety usually, but let's try a simple visual or just text animation.

        // We'll just stick to text animation to avoid dead links.
        // But since we want "rich", we can try effectively using the delay.

        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s suspense

        const isHeads = Math.random() < 0.5;
        const result = isHeads ? 'HEADS' : 'TAILS';
        const emoji = isHeads ? '🪙' : '🦅';
        const color = isHeads ? 0xf1c40f : 0xbdc3c7; // Gold vs Silver
        const image = isHeads
            ? 'https://em-content.zobj.net/source/microsoft-teams/337/coin_1🪙.png'
            : 'https://em-content.zobj.net/source/microsoft-teams/337/bald-eagle_1f985.png'; // Fallback images or just large thumbnails

        const embedResult = new EmbedBuilder()
            .setColor(color)
            .setTitle(`It's ${result}!`)
            .setDescription(`## ${emoji} The coin landed on **${result}**!`)
            .setFooter({ text: `Flipped by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({
            content: null,
            embeds: [embedResult]
        });
    },
} as Command;
