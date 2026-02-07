import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your or another user\'s balance')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to check balance for')
                .setRequired(false)
        ),
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const profile = getUserProfile(interaction.guildId!, user.id);

        // Determine wealth tier for color and badge
        let color = 0x95a5a6;
        let badge = '💵';
        if (profile.balance >= 10000) {
            color = 0xffd700;
            badge = '💎';
        } else if (profile.balance >= 5000) {
            color = 0xe74c3c;
            badge = '💰';
        } else if (profile.balance >= 1000) {
            color = 0x3498db;
            badge = '💸';
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: `${user.username}'s Wallet`, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 256 }))
            .setDescription(`${badge} **Balance**\n\`\`\`💰 ${profile.balance.toLocaleString()} coins\`\`\``)
            .addFields(
                { name: '📊 Level', value: `${profile.level}`, inline: true },
                { name: '✨ Total XP', value: `${profile.xp.toLocaleString()}`, inline: true },
                { name: '💎 Wealth Tier', value: badge === '💎' ? 'Diamond' : badge === '💰' ? 'Gold' : badge === '💸' ? 'Silver' : 'Bronze', inline: true }
            )
            .setFooter({ text: `${user.tag} • Use /daily and /work to earn more!` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
