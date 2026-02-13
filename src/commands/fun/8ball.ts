import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';

const RESPONSES = [
    'Yes, definitely.',
    'It is certain.',
    'Without a doubt.',
    'Yes.',
    'Most likely.',
    'Outlook good.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
];

export default {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8ball a question')
        .addStringOption(option =>
            option
                .setName('question')
                .setDescription('Your question')
                .setRequired(true)
        ),
    category: 'fun',
    async execute(interaction) {
        const question = interaction.options.getString('question', true);
        const response = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('🎱 Magic 8Ball')
            .addFields(
                { name: '❓ Question', value: `\`${question}\`` },
                { name: '🎱 Answer', value: `**${response}**` }
            )
            .setFooter({ text: `Asked by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
