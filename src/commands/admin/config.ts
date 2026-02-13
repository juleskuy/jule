import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, ChatInputCommandInteraction } from 'discord.js';
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
                .setName('leveling')
                .setDescription('Enable or disable leveling system')
                .addBooleanOption(option =>
                    option
                        .setName('enabled')
                        .setDescription('Whether to enable leveling')
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
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'view') {
            const config = getGuildConfig(interaction.guildId!);
            const guild = interaction.guild;

            const embed = new EmbedBuilder()
                .setColor(0x2b2d31) // Discord dark theme background matching
                .setTitle(`⚙️ Configuration for ${guild?.name}`)
                .setDescription('Here are the current settings for this server.')
                .addFields(
                    {
                        name: '📊 General',
                        value: [
                            `**Leveling System:** ${config.levelingEnabled ? '✅ Enabled' : '❌ Disabled'}`,
                            `**Prefix:** \`${config.prefix || '!'}\``
                        ].join('\n'),
                        inline: false
                    },
                    {
                        name: '📺 Channels',
                        value: [
                            `**Welcome:** ${config.welcomeChannel ? `<#${config.welcomeChannel}>` : '❌ Not set'}`,
                            `**Goodbye:** ${config.goodbyeChannel ? `<#${config.goodbyeChannel}>` : '❌ Not set'}`,
                            `**Mod Logs:** ${config.modLogChannel ? `<#${config.modLogChannel}>` : '❌ Not set'}`,
                            `**Join to Create:** ${config.joinToCreateChannelId ? `<#${config.joinToCreateChannelId}>` : '❌ Not set'}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '🎭 Roles',
                        value: [
                            `**Auto Role:** ${config.autoRole ? `<@&${config.autoRole}>` : '❌ Not set'}`,
                            `**Muted Role:** ${config.mutedRole ? `<@&${config.mutedRole}>` : '❌ Not set'}`
                        ].join('\n'),
                        inline: true
                    }
                )
                .setThumbnail(guild?.iconURL() || null)
                .setFooter({ text: 'Use /config <option> to change these settings' })
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
        } else if (subcommand === 'leveling') {
            const enabled = interaction.options.getBoolean('enabled', true);
            updateGuildConfig(interaction.guildId!, { levelingEnabled: enabled });
            message = `Leveling system has been ${enabled ? 'enabled' : 'disabled'}`;
        }

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('✅ Configuration Updated')
            .setDescription(message)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
