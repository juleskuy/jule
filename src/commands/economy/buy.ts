import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { getUserProfile, updateUserProfile } from '../../database';
import { getItem, COMM_ITEMS } from '../../utils/items';

export default {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Purchase an item from the shop')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The item to buy')
                .setRequired(true)
                .setAutocomplete(true) // We will implement basic autocomplete later or just use string
        ),
    category: 'economy',
    async execute(interaction) {
        const itemName = interaction.options.getString('item', true);
        const item = getItem(itemName);

        // Simple fuzzy search or exact match
        const foundItem = COMM_ITEMS.find(i =>
            i.id.toLowerCase() === itemName.toLowerCase() ||
            i.name.toLowerCase() === itemName.toLowerCase()
        );

        if (!foundItem) {
            return interaction.reply({ content: `❌ **Item not found.** Check \`/shop\` for available items.`, ephemeral: true });
        }

        const profile = await getUserProfile(interaction.guildId!, interaction.user.id);

        if (profile.balance < foundItem.price) {
            return interaction.reply({ content: `❌ **Insufficient funds.** You need 🪙 \`${(foundItem.price - profile.balance).toLocaleString()}\` more.`, ephemeral: true });
        }

        // Purchase Logic
        profile.balance -= foundItem.price;

        // Add to inventory
        if (!profile.inventory) profile.inventory = {};
        if (!profile.inventory[foundItem.id]) profile.inventory[foundItem.id] = 0;
        profile.inventory[foundItem.id]++;

        // Save
        await updateUserProfile(interaction.guildId!, interaction.user.id, {
            balance: profile.balance,
            inventory: profile.inventory
        });

        await interaction.reply({ content: `✅ **Successfully purchased ${foundItem.emoji} ${foundItem.name}!**\nNew Balance: 🪙 \`${profile.balance.toLocaleString()}\`` });
    },
} as Command;
