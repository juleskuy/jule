import { Events, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../types/client';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const client = interaction.client as ExtendedClient;
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        if (command.permissions && interaction.guild) {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member?.permissions.has(command.permissions)) {
                return interaction.reply({
                    content: '❌ You do not have permission to use this command.',
                    ephemeral: true,
                });
            }
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${interaction.commandName}:`, error);
            const reply = {
                content: '❌ There was an error executing this command.',
                ephemeral: true,
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    },
};
