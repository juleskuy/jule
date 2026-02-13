import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';

const WORK_MIN = 50;
const WORK_MAX = 150;
const WORK_COOLDOWN = 3600000; // 1 hour

const JOBS = [
    { title: 'Software Developer', emoji: '💻', action: 'coded a new feature' },
    { title: 'Food Courier', emoji: '🍔', action: 'delivered 15 orders' },
    { title: 'Streamer', emoji: '📺', action: 'streamed for 4 hours' },
    { title: 'Artist', emoji: '🎨', action: 'completed a commission' },
    { title: 'Barista', emoji: '☕', action: 'served 100 coffees' },
    { title: 'Construction Worker', emoji: '🏗️', action: 'built a wall' }
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
            return interaction.reply({
                content: `⏳ **You are recharging!**\nYou can work again in **${minutes}m**. Take a break!`,
                ephemeral: true
            });
        }

        const earned = Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1)) + WORK_MIN;
        const job = JOBS[Math.floor(Math.random() * JOBS.length)];
        const newBalance = profile.balance + earned;

        updateUserProfile(interaction.guildId!, interaction.user.id, {
            balance: newBalance,
            lastWork: now,
        });

        const embed = new EmbedBuilder()
            .setColor(0x34495e) // Dark blue/grey for work
            .setTitle(`💼 Shift Completed: ${job.title}`)
            .setDescription(`You ${job.action} and earned a paycheck!`)
            .addFields(
                { name: '💰 Earned', value: `\`+${earned} coins\``, inline: true },
                { name: '💵 Wallet', value: `\`${newBalance.toLocaleString()} coins\``, inline: true }
            )
            .setThumbnail('https://em-content.zobj.net/source/microsoft-teams/337/briefcase_1f4bc.png')
            .setFooter({ text: `Great work, ${interaction.user.username}!`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
