import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';

const DAILY_AMOUNT = 100;
const DAILY_COOLDOWN = 86400000; // 24 hours

export default {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily reward'),
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const profile = await getUserProfile(interaction.guildId!, interaction.user.id);
        const now = Date.now();

        if (profile.lastDaily && now - profile.lastDaily < DAILY_COOLDOWN) {
            const timeLeft = DAILY_COOLDOWN - (now - profile.lastDaily);
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);

            const embed = new EmbedBuilder()
                .setColor(0xe74c3c) // Red for fail/wait
                .setAuthor({ name: 'Daily Reward Status', iconURL: interaction.user.displayAvatarURL() })
                .setTitle('⏳ Claim Cooldown')
                .setDescription(`You've already claimed your daily reward!\n\nPlease return in:`)
                .addFields({ name: '⏱️ Time Remaining', value: `\`\`\`bash\n${hours}h ${minutes}m ${seconds}s\n\`\`\``, inline: false })
                .setFooter({ text: 'Rewards reset every 24 hours' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const newBalance = profile.balance + DAILY_AMOUNT;

        // Random Item Drop (30% Chance)
        let dropMsg = '';
        if (Math.random() < 0.3) {
            const { COMM_ITEMS } = await import('../../utils/items');
            const dropItem = COMM_ITEMS.find(i => i.usable && i.price < 500); // Only small consumable items
            if (dropItem) {
                if (!profile.inventory) profile.inventory = {};
                if (!profile.inventory[dropItem.id]) profile.inventory[dropItem.id] = 0;
                profile.inventory[dropItem.id]++;
                dropMsg = `\n🎁 **Bonus:** You found a **${dropItem.emoji} ${dropItem.name}**!`;
            }
        }

        await updateUserProfile(interaction.guildId!, interaction.user.id, {
            balance: newBalance,
            lastDaily: now,
            inventory: profile.inventory
        });

        // Determine a simple streak visual (even if we don't track streak strictly yet, we can hype it up)
        const embed = new EmbedBuilder()
            .setColor(0x2ecc71) // Green for success
            .setAuthor({ name: 'Daily Login Bonus', iconURL: interaction.user.displayAvatarURL() })
            .setTitle('🎁 Reward Claimed!')
            .setDescription(`Here is your daily allowance! Come back tomorrow for more.${dropMsg}`)
            .setThumbnail('https://em-content.zobj.net/source/microsoft-teams/337/wrapped-gift_1f381.png') // Gift emoji large
            .addFields(
                { name: '💰 Amount', value: `\`+${DAILY_AMOUNT} coins\``, inline: true },
                { name: '💳 New Balance', value: `\`${newBalance.toLocaleString()} coins\``, inline: true }
            )
            .setFooter({ text: 'Daily Reward System • Jule Bot', iconURL: interaction.client.user?.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
