import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';

const RESPONSES = [
    { text: 'It is certain.', emoji: '✅', color: 0x2ecc71 },
    { text: 'It is decidedly so.', emoji: '✅', color: 0x2ecc71 },
    { text: 'Without a doubt.', emoji: '✅', color: 0x2ecc71 },
    { text: 'Yes - definitely.', emoji: '✅', color: 0x2ecc71 },
    { text: 'You may rely on it.', emoji: '✅', color: 0x2ecc71 },
    { text: 'As I see it, yes.', emoji: '✅', color: 0x2ecc71 },
    { text: 'Most likely.', emoji: '✅', color: 0x2ecc71 },
    { text: 'Outlook good.', emoji: '✅', color: 0x2ecc71 },
    { text: 'Yes.', emoji: '✅', color: 0x2ecc71 },
    { text: 'Signs point to yes.', emoji: '✅', color: 0x2ecc71 },
    { text: 'Reply hazy, try again.', emoji: '💤', color: 0xf1c40f },
    { text: 'Ask again later.', emoji: '💤', color: 0xf1c40f },
    { text: 'Better not tell you now.', emoji: '😶', color: 0xf1c40f },
    { text: 'Cannot predict now.', emoji: '😶', color: 0xf1c40f },
    { text: 'Concentrate and ask again.', emoji: '🤔', color: 0xf1c40f },
    { text: 'Don\'t count on it.', emoji: '❌', color: 0xe74c3c },
    { text: 'My reply is no.', emoji: '❌', color: 0xe74c3c },
    { text: 'My sources say no.', emoji: '❌', color: 0xe74c3c },
    { text: 'Outlook not so good.', emoji: '❌', color: 0xe74c3c },
    { text: 'Very doubtful.', emoji: '❌', color: 0xe74c3c },
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
    async execute(interaction: ChatInputCommandInteraction) {
        const question = interaction.options.getString('question', true);
        const choice = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];

        const embed = new EmbedBuilder()
            .setColor(choice.color)
            .setAuthor({ name: 'The Magic 8-Ball', iconURL: 'https://em-content.zobj.net/source/microsoft-teams/337/pool-8-ball_1f3b1.png' })
            .setTitle(choice.emoji + ' ' + choice.text)
            .setDescription(`**Question:** ${question}`)
            .setFooter({ text: `Asked by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Use a "thinking" animation with editReply to build suspense
        await interaction.deferReply();

        // Optional: wait a tiny bit to simulate "divining" the answer
        await new Promise(resolve => setTimeout(resolve, 1500));

        await interaction.editReply({ embeds: [embed] });
    },
} as Command;
