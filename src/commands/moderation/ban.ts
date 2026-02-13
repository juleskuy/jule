import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { addCase, getNextCaseId } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user').setDescription('The user to ban').setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason').setDescription('The reason for the ban').setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('delete-days').setDescription('Delete messages from the last X days (0-7)').setMinValue(0).setMaxValue(7).setRequired(false)
        ),
    category: 'moderation',
    permissions: [PermissionFlagsBits.BanMembers],
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const deleteDays = interaction.options.getInteger('delete-days') || 0;

        const member = interaction.guild?.members.cache.get(user.id);
        if (member && !member.bannable) {
            return interaction.reply({ content: '🚫 **Permission Error.** I cannot ban this user.', ephemeral: true });
        }

        const caseId = await getNextCaseId(interaction.guildId!);

        try {
            // Try to DM the user first
            const dmEmbed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle(`🔨 You have been banned from ${interaction.guild?.name}`)
                .setDescription(`You have been banned from the server.\n\n**Reason:** ${reason}\n\nIf you believe this is a mistake, please contact the server administration.`)
                .setFooter({ text: `Case #${caseId}` })
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] }).catch(() => { }); // catch ignore if DM fails

            await interaction.guild?.members.ban(user, { reason, deleteMessageSeconds: deleteDays * 86400 });

            await addCase({
                caseId,
                guildId: interaction.guildId!,
                userId: user.id,
                moderatorId: interaction.user.id,
                action: 'ban',
                reason,
                timestamp: Date.now(),
            });

            const embed = new EmbedBuilder()
                .setColor(0xe74c3c) // Red
                .setTitle('🔨 User Banned')
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: '👤 Banned User', value: `${user.tag} (\`${user.id}\`)`, inline: false },
                    { name: '🛡️ Moderator', value: `${interaction.user}`, inline: true },
                    { name: '📄 Case ID', value: `\`#${caseId}\``, inline: true },
                    { name: '📝 Reason', value: `\`\`\`${reason}\`\`\``, inline: false }
                )
                .setFooter({ text: 'Moderation Action • Jule Bot', iconURL: interaction.client.user?.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ **Error.** Something went wrong while trying to ban the user.', ephemeral: true });
        }
    },
} as Command;
