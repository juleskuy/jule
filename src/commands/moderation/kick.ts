import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { addCase, getNextCaseId } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user').setDescription('The user to kick').setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason').setDescription('The reason for the kick').setRequired(false)
        ),
    category: 'moderation',
    permissions: [PermissionFlagsBits.KickMembers],
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild?.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: '🚫 **User not found.** This user is not in the server.', ephemeral: true });
        }
        if (!member.kickable) {
            return interaction.reply({ content: '🚫 **Permission Error.** I cannot kick this user.', ephemeral: true });
        }

        const caseId = await getNextCaseId(interaction.guildId!);

        try {
            // Notify User
            const dmEmbed = new EmbedBuilder()
                .setColor(0xe67e22) // Orange
                .setTitle(`👢 You have been kicked from ${interaction.guild?.name}`)
                .setDescription(`Reason: **${reason}**\n\nYou can rejoin if you have an invite link.`)
                .setFooter({ text: `Case #${caseId}` })
                .setTimestamp();
            await user.send({ embeds: [dmEmbed] }).catch(() => { });

            await member.kick(reason);

            await addCase({
                caseId,
                guildId: interaction.guildId!,
                userId: user.id,
                moderatorId: interaction.user.id,
                action: 'kick',
                reason,
                timestamp: Date.now(),
            });

            const embed = new EmbedBuilder()
                .setColor(0xe67e22) // Orange for Kick
                .setTitle('👢 User Kicked')
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: '👤 Kicked User', value: `${user.tag} (\`${user.id}\`)`, inline: false },
                    { name: '🛡️ Moderator', value: `${interaction.user}`, inline: true },
                    { name: '📄 Case ID', value: `\`#${caseId}\``, inline: true },
                    { name: '📝 Reason', value: `\`\`\`${reason}\`\`\``, inline: false }
                )
                .setFooter({ text: 'Moderation Action • Jule Bot', iconURL: interaction.client.user?.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ **Error.** Could not kick the user.', ephemeral: true });
        }
    },
} as Command;
