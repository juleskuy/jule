import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete multiple messages')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Only delete messages from this user')
                .setRequired(false)
        ),
    category: 'moderation',
    permissions: [PermissionFlagsBits.ManageMessages],
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount', true);
        const user = interaction.options.getUser('user');
        const channel = interaction.channel as TextChannel;

        await interaction.deferReply({ ephemeral: true });

        const messages = await channel.messages.fetch({ limit: amount });

        let filteredMessages = messages;
        if (user) {
            filteredMessages = messages.filter(msg => msg.author.id === user.id);
        }

        const deleted = await channel.bulkDelete(filteredMessages, true);

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('🗑️ Messages Purged')
            .setDescription(`Successfully deleted ${deleted.size} message(s)${user ? ` from ${user.tag}` : ''}.`)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
} as Command;
