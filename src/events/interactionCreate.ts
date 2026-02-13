import { Events, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../types/client';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction | any) {

        // --- COMMAND HANDLING ---
        if (interaction.isChatInputCommand()) {
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
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '❌ There was an error executing this command.', ephemeral: true });
                } else {
                    await interaction.reply({ content: '❌ There was an error executing this command.', ephemeral: true });
                }
            }
        }

        // --- BUTTON HANDLING ---
        else if (interaction.isButton()) {

            // 1. VOICE MASTER
            if (interaction.customId.startsWith('vm_')) {
                const channel = interaction.channel;
                const member = interaction.member;

                // Owner Check
                if (!channel.permissionsFor(member).has(BigInt(0x0000000000000010))) { // ManageChannels
                    return interaction.reply({ content: '🚫 You do not own this temporary channel.', ephemeral: true });
                }

                // Handle Rename (Modal) - Must be before defer
                if (interaction.customId === 'vm_rename') {

                    const modal = new ModalBuilder()
                        .setCustomId('vm_rename_modal')
                        .setTitle('Rename Channel');

                    const nameInput = new TextInputBuilder()
                        .setCustomId('vm_new_name')
                        .setLabel("New Channel Name")
                        .setStyle(TextInputStyle.Short)
                        .setMinLength(1)
                        .setMaxLength(30)
                        .setRequired(true);

                    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
                    modal.addComponents(row);

                    return interaction.showModal(modal);
                }

                // Handle Actions
                await interaction.deferReply({ ephemeral: true });

                try {
                    switch (interaction.customId) {
                        case 'vm_lock':
                            await channel.permissionOverwrites.edit(interaction.guild!.id, { Connect: false });
                            await interaction.editReply({ content: '🔒 **Locked.** No one can join.' });
                            break;
                        case 'vm_unlock':
                            await channel.permissionOverwrites.edit(interaction.guild!.id, { Connect: null });
                            await interaction.editReply({ content: '🔓 **Unlocked.** Everyone can join.' });
                            break;
                        case 'vm_hide':
                            await channel.permissionOverwrites.edit(interaction.guild!.id, { ViewChannel: false });
                            await interaction.editReply({ content: '👻 **Hidden.** No one can see this channel.' });
                            break;
                        case 'vm_unhide':
                            await channel.permissionOverwrites.edit(interaction.guild!.id, { ViewChannel: null });
                            await interaction.editReply({ content: '👀 **Visible.** Everyone can see this channel.' });
                            break;
                    }
                } catch (error) {
                    console.error(error);
                    await interaction.editReply({ content: '❌ Error updating channel settings.' });
                }
            }

            // 2. TICKET SYSTEM
            else if (interaction.customId === 'create_ticket' || interaction.customId === 'close_ticket') {

                if (interaction.customId === 'create_ticket') {
                    const { getGuildConfig } = await import('../database');
                    const config = await getGuildConfig(interaction.guildId!);
                    const categoryId = config.ticketCategoryId;

                    if (!categoryId) {
                        return interaction.reply({ content: '❌ Ticket system is not configured.', ephemeral: true });
                    }

                    await interaction.deferReply({ ephemeral: true });

                    const channelName = `ticket-${interaction.user.username}`;
                    const existing = interaction.guild?.channels.cache.find((c: any) => c.name === channelName && c.parentId === categoryId);

                    if (existing) {
                        return interaction.editReply({ content: `You already have a ticket open: ${existing}` });
                    }

                    try {
                        const ticketChannel = await interaction.guild?.channels.create({
                            name: channelName,
                            type: ChannelType.GuildText,
                            parent: categoryId,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild!.id,
                                    deny: [PermissionFlagsBits.ViewChannel],
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
                                },
                            ],
                        });

                        const embed = new EmbedBuilder()
                            .setColor(0x2ecc71)
                            .setTitle(`Ticket for ${interaction.user.username}`)
                            .setDescription('Describe your issue here. Support will be with you shortly.')
                            .setTimestamp();

                        const row = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('close_ticket')
                                    .setLabel('Close Ticket')
                                    .setEmoji('🔒')
                                    .setStyle(ButtonStyle.Danger)
                            );

                        await ticketChannel?.send({ content: `${interaction.user} Welcome!`, embeds: [embed], components: [row] });
                        await interaction.editReply({ content: `✅ Ticket created: ${ticketChannel}` });

                    } catch (error) {
                        console.error(error);
                        await interaction.editReply({ content: '❌ Failed to create ticket channel.' });
                    }
                }

                else if (interaction.customId === 'close_ticket') {
                    await interaction.deferReply();
                    const channel = interaction.channel;

                    // Generate Transcript & Log
                    const { getGuildConfig } = await import('../database');
                    const config = await getGuildConfig(interaction.guildId!);
                    const discordTranscripts = await import('discord-html-transcripts');

                    const attachment = await discordTranscripts.createTranscript(channel, {
                        limit: -1,
                        filename: `${channel.name}-transcript.html`,
                        saveImages: true,
                        poweredBy: false
                    });

                    const logChannelId = config.ticketTranscriptChannelId;
                    if (logChannelId) {
                        const logChannel = interaction.guild?.channels.cache.get(logChannelId);
                        if (logChannel && logChannel.isTextBased()) {
                            await logChannel.send({
                                content: `Transcript for **${channel.name}** (Closed by ${interaction.user.tag})`,
                                files: [attachment] as any
                            });
                        }
                    }

                    await interaction.editReply({ content: '🔒 Ticket closed. Deleting in 5 seconds...' });
                    setTimeout(() => channel.delete().catch(() => { }), 5000);
                }
            }
        }

        // --- MODAL HANDLING ---
        else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'vm_rename_modal') {
                const newName = interaction.fields.getTextInputValue('vm_new_name');
                await interaction.channel?.setName(newName);
                await interaction.reply({ content: `✅ Renamed to **${newName}**!`, ephemeral: true });
            }
        }
    },
};
