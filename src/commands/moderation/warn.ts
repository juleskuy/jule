import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { addWarning, addCase, getNextCaseId, getUserWarnings } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option =>
            option.setName('user').setDescription('The user to warn').setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason').setDescription('The reason for warning').setRequired(true)
        ),
    category: 'moderation',
    permissions: [PermissionFlagsBits.ModerateMembers],
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason', true);
        const guildId = interaction.guildId!;

        // Add Warning
        await addWarning({
            id: `${Date.now()}-${user.id}`,
            userId: user.id,
            guildId,
            moderatorId: interaction.user.id,
            reason,
            timestamp: Date.now(),
        });

        // Add Case
        const caseId = await getNextCaseId(guildId);
        await addCase({
            caseId,
            guildId,
            userId: user.id,
            moderatorId: interaction.user.id,
            action: 'warn',
            reason,
            timestamp: Date.now(),
        });

        // Notify User
        const dmEmbed = new EmbedBuilder()
            .setColor(0xf39c12) // Orange-Gold
            .setTitle(`⚠️ Warning Received in ${interaction.guild?.name}`)
            .setDescription(`**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`)
            .setFooter({ text: 'Please follow the server rules.' })
            .setTimestamp();
        await user.send({ embeds: [dmEmbed] }).catch(() => { });

        // Get total warnings for display
        const warnings = await getUserWarnings(guildId, user.id);

        const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle('⚠️ User Warned')
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: '👤 User', value: `${user} (\`${user.id}\`)`, inline: false },
                { name: '🛡️ Moderator', value: `${interaction.user}`, inline: true },
                { name: '📄 Case ID', value: `\`#${caseId}\``, inline: true },
                { name: '❗ Total Warnings', value: `\`${warnings.length}\``, inline: true },
                { name: '📝 Reason', value: `\`\`\`${reason}\`\`\``, inline: false }
            )
            .setFooter({ text: 'Moderation Action • Jule Bot', iconURL: interaction.client.user?.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
