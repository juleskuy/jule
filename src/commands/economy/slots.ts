import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';

const COST = 50;
// Using consistent emojis
const SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '🔔', '💎', '7️⃣'];

export default {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription(`Play slots for ${COST} coins!`),
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const profile = getUserProfile(interaction.guildId!, interaction.user.id);

        if (profile.balance < COST) {
            await interaction.reply({ content: `❌ You need at least **${COST}** coins to play!`, ephemeral: true });
            return;
        }

        // Deduct cost
        const costDeductedBalance = profile.balance - COST;
        updateUserProfile(interaction.guildId!, interaction.user.id, { balance: costDeductedBalance });

        // Spin
        const slots = [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        ];

        let winnings = 0;
        let resultText = 'Better luck next time!';

        // Calculate Winnings
        if (slots[0] === slots[1] && slots[1] === slots[2]) {
            winnings = COST * 10; // Jackpot 10x
            resultText = '🎉 **JACKPOT!** You won big! 🎉';
            if (slots[0] === '💎' || slots[0] === '7️⃣') {
                winnings = COST * 20; // Super Jackpot 20x
                resultText = '💎 **SUPER JACKPOT!** UNBELIEVABLE! 💎';
            }
        } else if (slots[0] === slots[1] || slots[1] === slots[2] || slots[0] === slots[2]) {
            winnings = Math.floor(COST * 1.5); // Small win 1.5x
            resultText = 'Nice! Two in a row!';
        }

        if (winnings > 0) {
            updateUserProfile(interaction.guildId!, interaction.user.id, { balance: costDeductedBalance + winnings });
        }

        const embed = new EmbedBuilder()
            .setColor(winnings > 0 ? 0x2ecc71 : 0xe74c3c)
            .setTitle('🎰 Slot Machine')
            .setDescription(`**[ ${slots.join(' | ')} ]**\n\n${resultText}`)
            .addFields(
                { name: '💰 Winnings', value: `\`${winnings}\` coins`, inline: true },
                { name: '💵 New Balance', value: `\`${(costDeductedBalance + winnings).toLocaleString()}\``, inline: true }
            )
            .setFooter({ text: `Cost: ${COST} coins` })
            .setThumbnail(interaction.user.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
