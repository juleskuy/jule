import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile } from '../../database';
import { getItem } from '../../utils/items';

export default {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Check your item inventory'),
    category: 'economy',
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const profile = getUserProfile(interaction.guildId!, user.id);

        if (!profile.inventory || Object.keys(profile.inventory).length === 0) {
            return interaction.reply({ content: `🎒 **${user.username}'s Inventory is empty.**\nUse \`/shop\` to buy items!`, ephemeral: true });
        }

        const inventoryList = Object.entries(profile.inventory)
            .filter(([_, count]) => count > 0)
            .map(([itemId, count]) => {
                const item = getItem(itemId);
                if (!item) return `Unknown Item (${itemId}) x${count}`;
                return `**${item.emoji} ${item.name}** — x${count}`;
            }).join('\n');

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setAuthor({ name: `${user.username}'s Inventory`, iconURL: user.displayAvatarURL() })
            .setDescription(inventoryList || 'Empty.')
            .setFooter({ text: `Balance: 🪙 ${profile.balance.toLocaleString()}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
