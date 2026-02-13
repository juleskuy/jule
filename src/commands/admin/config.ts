import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, ChatInputCommandInteraction, ColorResolvable } from 'discord.js';
import { Command } from '../../types/command';
import { updateGuildConfig, getGuildConfig } from '../../database';

const THEME = {
    SUCCESS: 0x2ecc71 as ColorResolvable,
    ERROR: 0xe74c3c as ColorResolvable,
    NEUTRAL: 0x2b2d31 as ColorResolvable
};

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
                .setName('ticket-category')
                .setDescription('Set the category for new tickets')
                .addChannelOption(option =>
                    option
                        .setName('category')
                        .setDescription('The category to create tickets in')
                        .addChannelTypes(ChannelType.GuildCategory)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticket-logs')
                .setDescription('Set the channel for ticket transcripts')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('The channel for transcripts')
                        .addChannelTypes(ChannelType.GuildText)
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
                .setColor(THEME.NEUTRAL)
                .setAuthor({ name: `Server Configuration`, iconURL: guild?.iconURL() || undefined })
                .setTitle(`⚙️ Settings for ${guild?.name}`)
                .setDescription('Below is the current configuration for your server. Use the `/config` commands to modify these settings.')
                .addFields(
                    {
                        name: '📊 General Settings',
                        value: [
                            `> **Leveling System**\n> ${config.levelingEnabled ? '✅ **Enabled**' : '❌ **Disabled**'}`
                        ].join('\n\n'),
                        inline: true
                    },
                    {
                        name: '📺 Channel Configuration',
                        value: [
                            `> **Welcome Channel**\n> ${config.welcomeChannel ? `<#${config.welcomeChannel}>` : '`Not Set`'}`,
                            `> **Goodbye Channel**\n> ${config.goodbyeChannel ? `<#${config.goodbyeChannel}>` : '`Not Set`'}`,
                            `> **Mod Logs**\n> ${config.modLogChannel ? `<#${config.modLogChannel}>` : '`Not Set`'}`,
                            `> **Join to Create**\n> ${config.joinToCreateChannelId ? `<#${config.joinToCreateChannelId}>` : '`Not Set`'}`
                        ].join('\n\n'),
                        inline: true
                    },
                    {
                        name: '🎭 Role Configuration',
                        value: [
                            `> **Auto Role**\n> ${config.autoRole ? `<@&${config.autoRole}>` : '`Not Set`'}`,
                            `> **Muted Role**\n> ${config.mutedRole ? `<@&${config.mutedRole}>` : '`Not Set`'}`
                        ].join('\n\n'),
                        inline: false
                    },
                    {
                        name: '🎫 Ticket System',
                        value: [
                            `> **Category**\n> ${config.ticketCategoryId ? `<#${config.ticketCategoryId}>` : '`Not Set`'}`,
                            `> **Transcripts**\n> ${config.ticketTranscriptChannelId ? `<#${config.ticketTranscriptChannelId}>` : '`Not Set`'}`
                        ].join('\n\n'),
                        inline: true
                    }
                )
                .setThumbnail(guild?.iconURL() || null)
                .setFooter({ text: 'Administrator Access Required • Jule Bot', iconURL: interaction.client.user?.displayAvatarURL() })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        let message = '';
        let settingName = '';
        let settingValue = '';

        if (subcommand === 'welcome') {
            const channel = interaction.options.getChannel('channel', true);
            if (channel && channel.type === ChannelType.GuildText) {
                updateGuildConfig(interaction.guildId!, { welcomeChannel: channel.id });
                settingName = 'Welcome Channel';
                settingValue = `${channel}`;
                message = `Welcome messages will now be sent to ${channel}`;
            }
        } else if (subcommand === 'goodbye') {
            const channel = interaction.options.getChannel('channel', true);
            if (channel && channel.type === ChannelType.GuildText) {
                updateGuildConfig(interaction.guildId!, { goodbyeChannel: channel.id });
                settingName = 'Goodbye Channel';
                settingValue = `${channel}`;
                message = `Goodbye messages will now be sent to ${channel}`;
            }
        } else if (subcommand === 'modlog') {
            const channel = interaction.options.getChannel('channel', true);
            if (channel && channel.type === ChannelType.GuildText) {
                updateGuildConfig(interaction.guildId!, { modLogChannel: channel.id });
                settingName = 'Mod Log Channel';
                settingValue = `${channel}`;
                message = `Moderation logs will be recorded in ${channel}`;
            }
        } else if (subcommand === 'autorole') {
            const role = interaction.options.getRole('role', true);
            updateGuildConfig(interaction.guildId!, { autoRole: role.id });
            settingName = 'Auto Role';
            settingValue = `${role}`;
            message = `New members will automatically receive the **${role.name}** role`;
        } else if (subcommand === 'leveling') {
            const enabled = interaction.options.getBoolean('enabled', true);
            updateGuildConfig(interaction.guildId!, { levelingEnabled: enabled });
            settingName = 'Leveling System';
            settingValue = enabled ? '✅ Enabled' : '❌ Disabled';
            message = `The leveling system has been **${enabled ? 'enabled' : 'disabled'}** for this server`;
        } else if (subcommand === 'ticket-category') {
            const category = interaction.options.getChannel('category', true);
            if (category && category.type === ChannelType.GuildCategory) {
                updateGuildConfig(interaction.guildId!, { ticketCategoryId: category.id });
                settingName = 'Ticket Category';
                settingValue = `${category.name}`;
                message = `Tickets will be created in **${category.name}**`;
            }
        } else if (subcommand === 'ticket-logs') {
            const channel = interaction.options.getChannel('channel', true);
            if (channel && channel.type === ChannelType.GuildText) {
                updateGuildConfig(interaction.guildId!, { ticketTranscriptChannelId: channel.id });
                settingName = 'Ticket Logs';
                settingValue = `${channel}`;
                message = `Transcripts will be sent to ${channel}`;
            }
        }

        const embed = new EmbedBuilder()
            .setColor(THEME.SUCCESS)
            .setTitle('✅ Configuration Updated')
            .setDescription(message)
            .addFields({ name: '🛠️ Setting Changed', value: `**${settingName}** → ${settingValue}`, inline: false })
            .setFooter({ text: `Updated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
