import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';

const DAILY_AMOUNT = 100;
const DAILY_COOLDOWN = 86400000; // 24 hours

export default {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily reward'),
    category: 'economy',
    async execute(interaction) {
        const profile = getUserProfile(interaction.guildId!, interaction.user.id);
        const now = Date.now();

        if (profile.lastDaily && now - profile.lastDaily < DAILY_COOLDOWN) {
            const timeLeft = DAILY_COOLDOWN - (now - profile.lastDaily);
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);

            const embed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle('⏰ Daily Reward Cooldown')
                .setDescription(`You've already claimed your daily reward!\n\n⏳ **Come back in:**\n\`\`\`${hours}h ${minutes}m ${seconds}s\`\`\``)
                .setFooter({ text: 'Daily rewards reset every 24 hours' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const newBalance = profile.balance + DAILY_AMOUNT;
        updateUserProfile(interaction.guildId!, interaction.user.id, {
            balance: newBalance,
            lastDaily: now,
        });

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('🎁 Daily Reward Claimed!')
            .setDescription(`Congratulations! You've received your daily bonus!\n\n💰 **Earned:** \`${DAILY_AMOUNT} coins\`\n💵 **New Balance:** \`${newBalance.toLocaleString()} coins\``)
            .setThumbnail(interaction.user.displayAvatarURL({ size: 128 }))
            .setFooter({ text: `Streak maintained! • ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
