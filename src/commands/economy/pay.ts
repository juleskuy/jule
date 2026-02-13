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
        ),
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user', true);
        const amount = interaction.options.getInteger('amount', true);

        // Validation Checks
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ content: '🚫 **Self-transfer error.** You cannot pay yourself!', ephemeral: true });
        }
        if (targetUser.bot) {
            return interaction.reply({ content: '🤖 **Bot error.** Bots cannot hold currency!', ephemeral: true });
        }

        const senderProfile = await getUserProfile(interaction.guildId!, interaction.user.id);

        if (senderProfile.balance < amount) {
            return interaction.reply({
                content: `💸 **Insufficient Funds.**\nYou need **${amount.toLocaleString()}** coins but only have **${senderProfile.balance.toLocaleString()}**.`,
                ephemeral: true
            });
        }

        const receiverProfile = await getUserProfile(interaction.guildId!, targetUser.id);

        // Transaction Execution
        const senderNewBal = senderProfile.balance - amount;
        const receiverNewBal = receiverProfile.balance + amount;

        await updateUserProfile(interaction.guildId!, interaction.user.id, { balance: senderNewBal });
        await updateUserProfile(interaction.guildId!, targetUser.id, { balance: receiverNewBal });

        // Receipt Embed
        const embed = new EmbedBuilder()
            .setColor(0x3498db) // Blue for transactions
            .setAuthor({ name: 'Jule Pay Transfer', iconURL: interaction.client.user?.displayAvatarURL() })
            .setTitle('✅ Transaction Successful')
            .setDescription(`A secure transfer has been processed from **${interaction.user.username}** to **${targetUser.username}**.`)
            .addFields(
                { name: '📤 Sender', value: `> **${interaction.user.username}**\n> New Bal: \`${senderNewBal.toLocaleString()}\``, inline: true },
                { name: '📥 Receiver', value: `> **${targetUser.username}**\n> Credit: \`+${amount.toLocaleString()}\``, inline: true }, // Don't show receiver's total balance for privacy/realism? Actually previous code did, I'll keep it simple
                { name: '💵 Amount', value: `\`\`\`css\n$${amount.toLocaleString()}\n\`\`\``, inline: false }
            )
            .setFooter({ text: `Transaction ID: ${Date.now().toString(36).toUpperCase()} • Jule Pay` }) // Fake transaction ID
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
