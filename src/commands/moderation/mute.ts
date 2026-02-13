import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { addCase, getNextCaseId, addTempMute } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Timeout a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to mute')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('duration')
                .setDescription('Duration in minutes (max 40320 = 28 days)')
                .setMinValue(1)
                .setMaxValue(40320)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for the mute')
                .setRequired(false)
        ),
    category: 'moderation',
    permissions: [PermissionFlagsBits.ModerateMembers],
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user', true);
        const duration = interaction.options.getInteger('duration', true);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild?.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
        }

        if (!member.moderatable) {
            return interaction.reply({ content: '❌ I cannot timeout this user.', ephemeral: true });
        }

        const guildId = interaction.guildId!;
        const caseId = getNextCaseId(guildId);
        const durationMs = duration * 60 * 1000;

        await member.timeout(durationMs, reason);

        addCase({
            caseId,
            guildId,
            userId: user.id,
            moderatorId: interaction.user.id,
            action: 'mute',
            reason,
            timestamp: Date.now(),
            duration: durationMs,
        });

        addTempMute({
            userId: user.id,
            guildId,
            endTime: Date.now() + durationMs,
            roleId: '',
        });

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('🔇 User Muted')
            .addFields(
                { name: '👤 User', value: `\`${user.tag}\``, inline: true },
                { name: '🛡️ Moderator', value: `\`${interaction.user.tag}\``, inline: true },
                { name: '📄 Case ID', value: `\`#${caseId}\``, inline: true },
                { name: '⏳ Duration', value: `\`${duration} minutes\``, inline: true },
                { name: '📝 Reason', value: reason }
            )
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
