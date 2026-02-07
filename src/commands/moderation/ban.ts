import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { addCase, getNextCaseId } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to ban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option
                .setName('delete-days')
                .setDescription('Delete messages from the last X days (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false)
        ),
    category: 'moderation',
    permissions: [PermissionFlagsBits.BanMembers],
    async execute(interaction) {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const deleteDays = interaction.options.getInteger('delete-days') || 0;
        const member = interaction.guild?.members.cache.get(user.id);

        if (member && !member.bannable) {
            return interaction.reply({ content: '❌ I cannot ban this user.', ephemeral: true });
        }

        const guildId = interaction.guildId!;
        const caseId = getNextCaseId(guildId);

        await interaction.guild?.members.ban(user, { reason, deleteMessageSeconds: deleteDays * 86400 });

        addCase({
            caseId,
            guildId,
            userId: user.id,
            moderatorId: interaction.user.id,
            action: 'ban',
            reason,
            timestamp: Date.now(),
        });

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('🔨 User Banned')
            .addFields(
                { name: 'User', value: `${user.tag}`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                { name: 'Case ID', value: `#${caseId}`, inline: true },
                { name: 'Reason', value: reason }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
