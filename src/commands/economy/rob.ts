import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';

const ROB_COOLDOWN = 3600000; // 1 hour
const FAIL_CHANCE = 0.5; // 50% risk
const FINE_PERCENT = 0.1; // 10% penalty on fail

export default {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Attempt to steal coins from another user (Risk: 50%)')
        .addUserOption(option =>
            option.setName('user').setDescription('The user to rob').setRequired(true)
        ),
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user', true);

        // Validation
        if (targetUser.id === interaction.user.id) return interaction.reply({ content: '🚫 You cannot rob yourself.', ephemeral: true });
        if (targetUser.bot) return interaction.reply({ content: '🚫 You cannot rob a bot security system.', ephemeral: true });

        await interaction.deferReply();

        const thiefProfile = getUserProfile(interaction.guildId!, interaction.user.id);
        const victimProfile = getUserProfile(interaction.guildId!, targetUser.id);
        const now = Date.now();

        // Cooldown Check
        if (thiefProfile.lastRob && now - thiefProfile.lastRob < ROB_COOLDOWN) {
            const timeLeft = ROB_COOLDOWN - (now - thiefProfile.lastRob);
            const minutes = Math.floor(timeLeft / 60000);
            return interaction.editReply({
                content: `🚓 **Police are on patrol!**\nYou need to lie low for **${minutes}m**. Don't try anything stupid.`
            });
        }

        // Balance Check
        if (thiefProfile.balance < 500) {
            return interaction.editReply({
                content: '🚫 **Insufficient Funds.**\nYou need at least **500 coins** to pay for bail if you get caught.'
            });
        }
        if (victimProfile.balance < 100) {
            return interaction.editReply({
                content: '🚫 **Target Invalid.**\nThat user is broke. Not worth the risk.'
            });
        }

        // Logic
        const success = Math.random() > FAIL_CHANCE;

        if (success) {
            const stealAmount = Math.floor(Math.random() * (victimProfile.balance * 0.2)) + 1; // max 20%

            updateUserProfile(interaction.guildId!, interaction.user.id, {
                balance: thiefProfile.balance + stealAmount,
                lastRob: now
            });
            updateUserProfile(interaction.guildId!, targetUser.id, {
                balance: victimProfile.balance - stealAmount
            });

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71) // Green success
                .setTitle('🕵️ Heist Successful!')
                .setDescription(`You managed to sneak away with some loot from **${targetUser.username}**!`)
                .setThumbnail('https://em-content.zobj.net/source/microsoft-teams/337/money-bag_1f4b0.png')
                .addFields(
                    { name: '💰 Stolen Amount', value: `\`+${stealAmount.toLocaleString()} coins\``, inline: true },
                    { name: '💵 New Balance', value: `\`${(thiefProfile.balance + stealAmount).toLocaleString()}\``, inline: true }
                )
                .setFooter({ text: 'Don\'t spend it all in one place!', iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } else {
            const fine = Math.floor(thiefProfile.balance * FINE_PERCENT);

            updateUserProfile(interaction.guildId!, interaction.user.id, {
                balance: thiefProfile.balance - fine,
                lastRob: now
            });

            const embed = new EmbedBuilder()
                .setColor(0xe74c3c) // Red fail
                .setTitle('🚨 BUSTED!')
                .setDescription(`**You were caught red-handed!**\nThe police have fined you for attempted robbery.`)
                .setThumbnail('https://em-content.zobj.net/source/microsoft-teams/337/police-car-light_1f6a8.png')
                .addFields(
                    { name: '👮 Fine Paid', value: `\`-${fine.toLocaleString()} coins\``, inline: true },
                    { name: '💵 Remaining Balance', value: `\`${(thiefProfile.balance - fine).toLocaleString()}\``, inline: true }
                )
                .setFooter({ text: 'Crime doesn\'t pay... usually.', iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    },
} as Command;
