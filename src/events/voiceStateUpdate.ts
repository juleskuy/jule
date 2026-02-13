import { ChannelType, PermissionFlagsBits, VoiceState } from 'discord.js';
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
                            allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers]
                        },
                        {
                            id: guild.id,
                            allow: [PermissionFlagsBits.Connect]
                        }
                    ]
                });

                // Move member to the new channel
                await member.voice.setChannel(newChannel);

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
