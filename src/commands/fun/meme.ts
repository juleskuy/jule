import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';

const JOKES = [
    { q: 'Why did the developer go broke?', a: 'Because he used up all his cache.' },
    { q: 'Why do programmers prefer dark mode?', a: 'Because light attracts bugs.' },
    { q: 'How many programmers does it take to change a light bulb?', a: 'None. It\'s a hardware problem.' },
    { q: 'What do you call a fake noodle?', a: 'An Impasta.' },
    { q: 'Why did the scarecrow win an award?', a: 'Because he was outstanding in his field.' }
];

const MEMES = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z5eXhmb3J6ZXJ6ZXJ6ZXJ6ZXJ6ZXJ6ZXJ6ZXJ6eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L2KhQ988d22G2iGad/giphy.gif', // Cat typing
    'https://media.giphy.com/media/unQ3IJU2RG7XMjJKTj/giphy.gif', // Hackerman
    'https://media.giphy.com/media/3o7TKr3nzbh5WgCFxe/giphy.gif', // Confused math lady
    'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif', // Dog this is fine
];

export default {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a random meme or programming joke'),
    category: 'fun',
    async execute(interaction: ChatInputCommandInteraction) {
        const isJoke = Math.random() < 0.5;

        // Ensure we properly randomly pick
        const randJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
        const randMeme = MEMES[Math.floor(Math.random() * MEMES.length)];

        if (isJoke) {
            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('🤣 Random Joke')
                .setDescription(`**${randJoke.q}**\n\n||${randJoke.a}||`) // Inline spoiler for better flow
                .setFooter({ text: 'Click the black box to reveal!' });
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🖼️ Random Meme')
                .setImage(randMeme)
                .setFooter({ text: 'Powered by Giphy / Jule' });
            await interaction.reply({ embeds: [embed] });
        }
    },
} as Command;
