import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Transfer money to another user')
        .addUserOption(option =>
            option.setName('user').setDescription('The user to pay').setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount').setDescription('Amount to pay').setMinValue(1).setRequired(true)
        ) as SlashCommandBuilder,
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user', true);
        const amount = interaction.options.getInteger('amount', true);

        if (targetUser.id === interaction.user.id) {
            await interaction.reply({ content: '❌ You cannot pay yourself!', ephemeral: true });
            return;
        }

        if (targetUser.bot) {
            await interaction.reply({ content: '❌ Bots do not need money!', ephemeral: true });
            return;
        }

        const senderProfile = getUserProfile(interaction.guildId!, interaction.user.id);

        if (senderProfile.balance < amount) {
            await interaction.reply({ content: `❌ You do not have enough coins! You have **${senderProfile.balance}** coins.`, ephemeral: true });
            return;
        }

        const receiverProfile = getUserProfile(interaction.guildId!, targetUser.id);

        // Update both profiles
        updateUserProfile(interaction.guildId!, interaction.user.id, { balance: senderProfile.balance - amount });
        updateUserProfile(interaction.guildId!, targetUser.id, { balance: receiverProfile.balance + amount });

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('💸 Payment Successful')
            .setDescription(`Successfully transferred **${amount.toLocaleString()}** coins to ${targetUser}!`)
            .addFields(
                { name: '📤 Sender Balance', value: `\`${(senderProfile.balance - amount).toLocaleString()}\``, inline: true },
                { name: '📥 Receiver Balance', value: `\`${(receiverProfile.balance + amount).toLocaleString()}\``, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
