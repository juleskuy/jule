import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Display information about the server'),
    category: 'utility',
    async execute(interaction) {
        const guild = interaction.guild;

        if (!guild) {
            return interaction.reply({
                content: '❌ This command can only be used in a server.',
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle(`${guild.name} Information`)
            .setThumbnail(guild.iconURL() || '')
            .addFields(
                { name: '📋 Server ID', value: guild.id, inline: true },
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
                { name: '📝 Channels', value: `${guild.channels.cache.size}`, inline: true },
                { name: '🎭 Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
                { name: '🚀 Boost Level', value: `${guild.premiumTier}`, inline: true },
                { name: '💎 Boost Count', value: `${guild.premiumSubscriptionCount || 0}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
