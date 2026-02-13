import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your or another user\'s balance')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to check balance for')
                .setRequired(false)
        ),
    category: 'economy',
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const profile = await getUserProfile(interaction.guildId!, user.id);

        // Determine wealth tier for color and badge
        let color = 0x95a5a6; // Silver
        let tierName = 'Standard';
        let tierEmoji = '💳';

        if (profile.balance >= 100000) {
            color = 0xffd700; // Gold
            tierName = 'Diamond Elite';
            tierEmoji = '💎';
        } else if (profile.balance >= 50000) {
            color = 0x9b59b6; // Purple
            tierName = 'Platinum';
            tierEmoji = '✨';
        } else if (profile.balance >= 10000) {
            color = 0x3498db; // Blue
            tierName = 'Gold';
            tierEmoji = '🥇';
        }

        // Calculate Net Worth
        let assetValue = 0;
        if (profile.inventory) {
            const { COMM_ITEMS } = await import('../../utils/items');
            for (const [itemId, rawCount] of Object.entries(profile.inventory)) {
                const count = rawCount as number;
                const item = COMM_ITEMS.find(i => i.id === itemId);
                if (item && count > 0) {
                    assetValue += item.price * count;
                }
            }
        }
        const netWorth = profile.balance + assetValue;

        const embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: `${user.username}'s Wallet`, iconURL: user.displayAvatarURL() })
            .setTitle(`${tierEmoji} ${tierName} Account`)
            .setDescription(`**Account Holder:** ${user}`)
            .addFields(
                { name: '💰 Cash Balance', value: `\`$${profile.balance.toLocaleString()}\``, inline: true },
                { name: '🎒 Asset Value', value: `\`$${assetValue.toLocaleString()}\``, inline: true },
                { name: '💎 Net Worth', value: `\`\`\`css\n$${netWorth.toLocaleString()}\n\`\`\``, inline: false },
                { name: '📊 Statistics', value: `> **Level:** ${profile.level}\n> **XP:** ${profile.xp.toLocaleString()}`, inline: true },
                { name: '🏆 Rank', value: `> **Tier:** ${tierName}`, inline: true }
            )
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: 'Jule Bank • Secure & Reliable', iconURL: interaction.client.user?.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
