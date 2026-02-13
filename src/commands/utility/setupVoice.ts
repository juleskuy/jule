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

                // Check Category
                let warningField = null;
                if (!voiceChannel.parentId) {
                    warningField = {
                        name: '⚠️ Configuration Warning',
                        value: '> Input channel is **not in a category**.\n> Created channels may clutter the top of your server list. We recommend moving the generator channel inside a category first.'
                    };
                }

                // Update Database
                updateGuildConfig(interaction.guild.id, {
                    joinToCreateChannelId: voiceChannel.id
                });

                const embed = new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('✅ Voice System Activated')
                    .setDescription(`The **Join to Create** system is now active!`)
                    .addFields(
                        { name: '🎙️ Generator Channel', value: `> ${voiceChannel} (\`${voiceChannel.id}\`)`, inline: false },
                        { name: 'ℹ️ How it works', value: '> Use this channel to automatically create temporary voice channels for users.' }
                    )
                    .setFooter({ text: 'Jule Voice Manager' })
                    .setTimestamp();

                if (warningField) {
                    embed.addFields(warningField);
                    embed.setColor(0xf1c40f); // Downgrade to yellow warning
                }

                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply({ content: '🚫 **Invalid Channel.** Please select a valid voice channel.' });
            }

        } catch (error) {
            console.error('Error setting up voice system:', error);
            await interaction.editReply({ content: '❌ **System Error.** Could not save configuration.' });
        }
    }
};

export default command;
