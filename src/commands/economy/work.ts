import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';

const WORK_MIN = 50;
const WORK_MAX = 150;
const WORK_COOLDOWN = 3600000; // 1 hour

const WORK_JOBS = [
    { title: '💻 Software Developer', emoji: '👨‍💻' },
    { title: '🍔 Food Delivery', emoji: '🛵' },
    { title: '🎮 Twitch Streamer', emoji: '📺' },
    { title: '🎨 Content Creator', emoji: '🎬' },
    { title: '🎵 Musician', emoji: '🎸' },
    { title: '📝 Freelance Writer', emoji: '✍️' },
    { title: '🏗️ Construction Worker', emoji: '👷' },
    { title: '🎭 Voice Actor', emoji: '🎤' },
];

export default {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to earn coins'),
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const profile = getUserProfile(interaction.guildId!, interaction.user.id);
        const now = Date.now();

        if (profile.lastWork && now - profile.lastWork < WORK_COOLDOWN) {
            const timeLeft = WORK_COOLDOWN - (now - profile.lastWork);
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);

            const embed = new EmbedBuilder()
                .setColor(0xe67e22)
                .setTitle('😴 You\'re Tired!')
                .setDescription(`You need to rest before working again!\n\n⏳ **Rest time remaining:**\n\`\`\`${minutes}m ${seconds}s\`\`\``)
                .setFooter({ text: 'Work cooldown resets every hour' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const earned = Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1)) + WORK_MIN;
        const job = WORK_JOBS[Math.floor(Math.random() * WORK_JOBS.length)];
        const newBalance = profile.balance + earned;

        updateUserProfile(interaction.guildId!, interaction.user.id, {
            balance: newBalance,
            lastWork: now,
        });

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('💼 Work Complete!')
            .setDescription(`${job.emoji} You worked as a **${job.title}**!\n\n💰 **Earned:** \`${earned} coins\`\n💵 **New Balance:** \`${newBalance.toLocaleString()} coins\``)
            .setThumbnail(interaction.user.displayAvatarURL({ size: 128 }))
            .setFooter({ text: `Great job! • ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
