import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';

const COST = 50;
const SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '🔔', '💎', '7️⃣'];

export default {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription(`Play slots for ${COST} coins!`),
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const profile = getUserProfile(interaction.guildId!, interaction.user.id);

        if (profile.balance < COST) {
            return interaction.reply({ content: `🚫 **Insufficient Funds.**\nYou need **${COST} coins** to play slots.`, ephemeral: true });
        }

        const costDeductedBalance = profile.balance - COST;
        updateUserProfile(interaction.guildId!, interaction.user.id, { balance: costDeductedBalance });

        // Spin
        const s1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const s2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const s3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        let winnings = 0;
        let title = '🎰 Better luck next time!';
        let color = 0x95a5a6; // Grey default

        // Win Logic
        if (s1 === s2 && s2 === s3) {
            winnings = COST * 10;
            title = '🎉 JACKPOT! Winner!';
            color = 0x2ecc71; // Green
            if (s1 === '💎' || s1 === '7️⃣') {
                winnings = COST * 20;
                title = '💎 SUPER JACKPOT! INSANE WIN!';
                color = 0x9b59b6; // Purple/Gold epic
            }
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            winnings = Math.floor(COST * 1.5);
            title = '✨ Small Win!';
            color = 0xf1c40f; // Yellow
        }

        if (winnings > 0) {
            updateUserProfile(interaction.guildId!, interaction.user.id, { balance: costDeductedBalance + winnings });
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(`
> **[  ${s1}  |  ${s2}  |  ${s3}  ]**
            `)
            .addFields(
                { name: '💰 Winnings', value: `\`${winnings}\` coins`, inline: true },
                { name: '💵 New Balance', value: `\`${(costDeductedBalance + winnings).toLocaleString()}\``, inline: true }
            )
            .setFooter({ text: `Bet: ${COST} coins • Jule Casino` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
