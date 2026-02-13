import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { addCase, getNextCaseId } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to kick')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for the kick')
                .setRequired(false)
        ),
    category: 'moderation',
    permissions: [PermissionFlagsBits.KickMembers],
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild?.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
        }

        if (!member.kickable) {
            return interaction.reply({ content: '❌ I cannot kick this user.', ephemeral: true });
        }

        const guildId = interaction.guildId!;
        const caseId = getNextCaseId(guildId);

        await member.kick(reason);

        addCase({
            caseId,
            guildId,
            userId: user.id,
            moderatorId: interaction.user.id,
            action: 'kick',
            reason,
            timestamp: Date.now(),
        });

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('👢 User Kicked')
            .addFields(
                { name: '👤 User', value: `\`${user.tag}\``, inline: true },
                { name: '🛡️ Moderator', value: `\`${interaction.user.tag}\``, inline: true },
                { name: '📄 Case ID', value: `\`#${caseId}\``, inline: true },
                { name: '📝 Reason', value: reason }
            )
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
