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
        let color = 0x95a5a6; // Silver
        let tierName = 'Standard';
        let tierEmoji = '💳';

        if (profile.balance >= 100000) {
            color = 0xffd700; // Gold
            tierName = 'Diamond Elite';
            tierEmoji = '💎';
        } else if (profile.balance >= 50000) {
            color = 0x9b59b6; // Purple
            tierName = 'Platinum';
            tierEmoji = '✨';
        } else if (profile.balance >= 10000) {
            color = 0x3498db; // Blue
            tierName = 'Gold';
            tierEmoji = '🥇';
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: `${user.username}'s Wallet`, iconURL: user.displayAvatarURL() })
            .setTitle(`${tierEmoji} ${tierName} Account`)
            .setDescription(`**Account Holder:** ${user}`)
            .addFields(
                { name: '💰 Total Balance', value: `\`\`\`css\n$${profile.balance.toLocaleString()}\n\`\`\``, inline: false },
                { name: '📊 Statistics', value: `> **Level:** ${profile.level}\n> **XP:** ${profile.xp.toLocaleString()}`, inline: true },
                { name: '🏆 Rank', value: `> **Tier:** ${tierName}`, inline: true }
            )
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: 'Jule Bank • Secure & Reliable', iconURL: interaction.client.user?.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
