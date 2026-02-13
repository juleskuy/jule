import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('ticket-panel')
        .setDescription('Send the ticket creation panel to this channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    category: 'utility',
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('📩 Customer Support')
            .setDescription('Need help? Click the button below to open a private ticket with our staff team.')
            .addFields(
                { name: '⏱️ Response Time', value: 'We usually respond within 24 hours.', inline: true },
                { name: '⚠️ Important', value: 'Please do not open multiple tickets for the same issue.', inline: true }
            )
            .setFooter({ text: 'Support System', iconURL: interaction.guild?.iconURL() || undefined });

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Create Ticket')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ content: '✅ Panel sent!', ephemeral: true });

        if (interaction.channel && interaction.channel.type === ChannelType.GuildText) {
            await interaction.channel.send({ embeds: [embed], components: [row] });
        }
    },
} as Command;
