import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { addWarning, addCase, getNextCaseId, getUserWarnings } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to warn')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for the warning')
                .setRequired(true)
        ),
    category: 'moderation',
    permissions: [PermissionFlagsBits.ModerateMembers],
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason', true);
        const guildId = interaction.guildId!;

        const warning = {
            id: `${Date.now()}-${user.id}`,
            userId: user.id,
            guildId,
            moderatorId: interaction.user.id,
            reason,
            timestamp: Date.now(),
        };

        addWarning(warning);

        const caseId = getNextCaseId(guildId);
        addCase({
            caseId,
            guildId,
            userId: user.id,
            moderatorId: interaction.user.id,
            action: 'warn',
            reason,
            timestamp: Date.now(),
        });

        const warnings = getUserWarnings(guildId, user.id);

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('⚠️ User Warned')
            .addFields(
                { name: '👤 User', value: `\`${user.tag}\``, inline: true },
                { name: '🛡️ Moderator', value: `\`${interaction.user.tag}\``, inline: true },
                { name: '📄 Case ID', value: `\`#${caseId}\``, inline: true },
                { name: '📝 Reason', value: reason },
                { name: '❗ Total Warnings', value: `\`${warnings.length}\``, inline: true }
            )
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
