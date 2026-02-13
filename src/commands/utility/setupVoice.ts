import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, VoiceChannel, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { updateGuildConfig } from '../../database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('setup-voice')
        .setDescription('Setup the Join to Create voice channel system')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The voice channel to use as the generator')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
        ) as SlashCommandBuilder,

    category: 'utility',

    execute: async (interaction) => {
        if (!interaction.guild) return;

        await interaction.deferReply({ ephemeral: true });

        try {
            const channel = interaction.options.getChannel('channel', true);

            if (channel && channel.type === ChannelType.GuildVoice) {
                const voiceChannel = channel as VoiceChannel;

                // Check if channel is in a category
                let warning = '';
                if (!voiceChannel.parentId) {
                    warning = '\n\n⚠️ **Note:** The selected voice channel is not in a category. Creating temporary channels might clutter your server list. It is recommended to put the generator channel inside a category.';
                }

                // Update Database
                updateGuildConfig(interaction.guild.id, {
                    joinToCreateChannelId: voiceChannel.id
                });

                const embed = new EmbedBuilder()
                    .setColor(0x2b2d31)
                    .setTitle('✅ Join to Create Setup')
                    .setDescription(`Successfully set up the voice creation system using **${voiceChannel.name}**!`)
                    .addFields(
                        { name: '🎙️ Generator Channel', value: `<#${voiceChannel.id}>`, inline: true }
                    )
                    .setTimestamp();

                if (warning) {
                    embed.addFields({ name: '⚠️ Warning', value: 'The selected channel is not in a category. Created channels might be unorganized.' });
                }

                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply({ content: '❌ Invalid channel type. Please select a voice channel.' });
            }

        } catch (error) {
            console.error('Error setting up voice system:', error);
            await interaction.editReply({ content: '❌ An error occurred while setting up the voice system.' });
        }
    }
};

export default command;
