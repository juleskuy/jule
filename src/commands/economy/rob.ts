import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';

const ROB_COOLDOWN = 3600000; // 1 hour
const FAIL_CHANCE = 0.5; // 50% fail
const FINE_PERCENT = 0.1; // Lose 10% of wallet on fail

export default {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Attempt to steal coins from another user (Risk: 50%)')
        .addUserOption(option =>
            option.setName('user').setDescription('The user to rob').setRequired(true)
        ) as SlashCommandBuilder,
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user', true);

        if (targetUser.id === interaction.user.id) {
            await interaction.reply({ content: '❌ You cannot rob yourself!', ephemeral: true });
            return;
        }

        if (targetUser.bot) {
            await interaction.reply({ content: '❌ You cannot rob bots!', ephemeral: true });
            return;
        }

        await interaction.deferReply();

        const thiefProfile = getUserProfile(interaction.guildId!, interaction.user.id);
        const victimProfile = getUserProfile(interaction.guildId!, targetUser.id);

        const now = Date.now();
        if (thiefProfile.lastRob && now - thiefProfile.lastRob < ROB_COOLDOWN) {
            const timeLeft = ROB_COOLDOWN - (now - thiefProfile.lastRob);
            const minutes = Math.floor(timeLeft / 60000);
            await interaction.editReply({ content: `👮 **Cooldown!** You're lying low for another \`${minutes}m ${Math.floor((timeLeft % 60000) / 1000)}s\`!` });
            return;
        }

        if (thiefProfile.balance < 500) {
            await interaction.editReply({ content: '❌ You need at least **500** coins to attempt a robbery (bail money)!' });
            return;
        }

        if (victimProfile.balance < 100) {
            await interaction.editReply({ content: '❌ That user is too poor to rob!' });
            return;
        }

        // Random Logic
        const success = Math.random() > FAIL_CHANCE;

        if (success) {
            const stealAmount = Math.floor(Math.random() * (victimProfile.balance * 0.2)) + 1; // Steal up to 20%

            updateUserProfile(interaction.guildId!, interaction.user.id, {
                balance: thiefProfile.balance + stealAmount,
                lastRob: now
            });
            updateUserProfile(interaction.guildId!, targetUser.id, {
                balance: victimProfile.balance - stealAmount
            });

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('🔫 Robbery Successful!')
                .setDescription(`You successfully stole **${stealAmount.toLocaleString()}** coins from ${targetUser}!`)
                .addFields(
                    { name: '💰 Stolen', value: `\`${stealAmount}\` coins`, inline: true },
                    { name: '💵 New Balance', value: `\`${(thiefProfile.balance + stealAmount).toLocaleString()}\``, inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else {
            const fine = Math.floor(thiefProfile.balance * FINE_PERCENT);

            updateUserProfile(interaction.guildId!, interaction.user.id, {
                balance: thiefProfile.balance - fine,
                lastRob: now
            });

            const embed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle('🚓 Busted!')
                .setDescription(`You were caught trying to rob ${targetUser}!\n\n👮 **Fine Paid:** \`${fine.toLocaleString()}\` coins (10% of balance)`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    },
} as Command;
