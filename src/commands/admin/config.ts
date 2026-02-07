import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } from 'discord.js';
import { Command } from '../../types/command';
import { updateGuildConfig, getGuildConfig } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure server settings')
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcome')
                .setDescription('Set the welcome channel')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('The channel for welcome messages')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('goodbye')
                .setDescription('Set the goodbye channel')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('The channel for goodbye messages')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('modlog')
                .setDescription('Set the moderation log channel')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('The channel for moderation logs')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('autorole')
                .setDescription('Set the auto role for new members')
                .addRoleOption(option =>
                    option
                        .setName('role')
                        .setDescription('The role to assign to new members')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View current server configuration')
        ),
    category: 'admin',
    permissions: [PermissionFlagsBits.Administrator],
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'view') {
            const config = getGuildConfig(interaction.guildId!);

            const embed = new EmbedBuilder()
                .setColor(0x5865f2)
                .setTitle('⚙️ Server Configuration')
                .addFields(
                    { name: 'Welcome Channel', value: config.welcomeChannel ? `<#${config.welcomeChannel}>` : 'Not set', inline: true },
                    { name: 'Goodbye Channel', value: config.goodbyeChannel ? `<#${config.goodbyeChannel}>` : 'Not set', inline: true },
                    { name: 'Mod Log Channel', value: config.modLogChannel ? `<#${config.modLogChannel}>` : 'Not set', inline: true },
                    { name: 'Auto Role', value: config.autoRole ? `<@&${config.autoRole}>` : 'Not set', inline: true }
                )
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        let message = '';

        if (subcommand === 'welcome') {
            const channel = interaction.options.getChannel('channel', true);
            updateGuildConfig(interaction.guildId!, { welcomeChannel: channel.id });
            message = `Welcome channel set to ${channel}`;
        } else if (subcommand === 'goodbye') {
            const channel = interaction.options.getChannel('channel', true);
            updateGuildConfig(interaction.guildId!, { goodbyeChannel: channel.id });
            message = `Goodbye channel set to ${channel}`;
        } else if (subcommand === 'modlog') {
            const channel = interaction.options.getChannel('channel', true);
            updateGuildConfig(interaction.guildId!, { modLogChannel: channel.id });
            message = `Moderation log channel set to ${channel}`;
        } else if (subcommand === 'autorole') {
            const role = interaction.options.getRole('role', true);
            updateGuildConfig(interaction.guildId!, { autoRole: role.id });
            message = `Auto role set to ${role}`;
        }

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('✅ Configuration Updated')
            .setDescription(message)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
