import { ChannelType, PermissionFlagsBits, VoiceState, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { getGuildConfig } from '../database';

const voiceStateUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member || oldState.member;
    const guild = newState.guild || oldState.guild;

    if (!member || !guild) return;

    const guildConfig = getGuildConfig(guild.id);
    if (!guildConfig || !guildConfig.joinToCreateChannelId) return;

    const generatorChannelId = guildConfig.joinToCreateChannelId;

    // Handle Join / Switch to Generator Channel
    if (newState.channelId === generatorChannelId) {
        const generatorChannel = guild.channels.cache.get(generatorChannelId);

        // Safety check: ensure generator channel exists and has a parent category
        if (generatorChannel && generatorChannel.parentId) {
            try {
                const channelName = `${member.displayName}'s Room`;

                // Create temporary channel in the same category
                const newChannel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice,
                    parent: generatorChannel.parentId,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.Connect]
                        },
                        {
                            id: guild.id,
                            allow: [PermissionFlagsBits.Connect]
                        }
                    ]
                });

                // Move member to the new channel
                await member.voice.setChannel(newChannel);

                // --- VoiceMaster Interface ---
                const embed = new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setTitle('🎛️ Voice Interface')
                    .setDescription(`Welcome to your temporary channel, **${member.displayName}**!\nUse the buttons below to manage your room.`)
                    .addFields(
                        { name: '🔒 Privacy', value: 'Lock/Unlock your room', inline: true },
                        { name: '👻 Visibility', value: 'Hide/Unhide your room', inline: true },
                        { name: '✏️ Edit', value: 'Rename your room', inline: true }
                    )
                    .setFooter({ text: 'Channel will be deleted when empty' });

                const row1 = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder().setCustomId('vm_lock').setLabel('Lock').setEmoji('🔒').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('vm_unlock').setLabel('Unlock').setEmoji('🔓').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('vm_hide').setLabel('Hide').setEmoji('👻').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('vm_unhide').setLabel('Unhide').setEmoji('👀').setStyle(ButtonStyle.Secondary),
                    );

                const row2 = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder().setCustomId('vm_rename').setLabel('Rename').setEmoji('✏️').setStyle(ButtonStyle.Primary),
                    );

                await newChannel.send({ content: `Hey ${member}!`, embeds: [embed], components: [row1, row2] });

            } catch (error) {
                console.error('Error creating temporary voice channel:', error);
            }
        }
    }

    // Handle Leave / Switch from a temporary channel
    if (oldState.channelId && oldState.channelId !== generatorChannelId) {
        const leftChannel = oldState.channel;

        if (leftChannel
            && leftChannel.parentId
            && leftChannel.members.size === 0) {

            // Check if the left channel is in the "Join to Create" category
            const generatorChannel = guild.channels.cache.get(generatorChannelId);

            if (generatorChannel && leftChannel.parentId === generatorChannel.parentId) {
                try {
                    await leftChannel.delete();
                } catch (error) {
                    console.error('Error deleting empty temporary voice channel:', error);
                }
            }
        }
    }
};

export default {
    name: 'voiceStateUpdate',
    once: false,
    execute: voiceStateUpdate
};
