import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { COMM_ITEMS } from '../../utils/items';

export default {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('View the item shop'),
    category: 'economy',
    async execute(interaction) {
        const itemsList = COMM_ITEMS.map(item => {
            return `**${item.emoji} ${item.name}** — 🪙 \`${item.price.toLocaleString()}\`\n> *${item.description}*`;
        }).join('\n\n');

        const embed = new EmbedBuilder()
            .setColor(0xf1c40f)
            .setTitle('🛒 Jule Item Shop')
            .setDescription(`Here are the items currently available for purchase.\nUse \`/buy <item>\` to purchase something!\n\n${itemsList}`)
            .setFooter({ text: 'Economy System' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
