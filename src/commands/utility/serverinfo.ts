import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Display information about the server'),
    category: 'utility',
    async execute(interaction) {
        const guild = interaction.guild;

        if (!guild) {
            return interaction.reply({ content: '🚫 **Server only command.**', ephemeral: true });
        }

        const owner = await guild.fetchOwner().catch(() => null);
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;

        // Channel counts
        const totalChannels = guild.channels.cache.size;
        const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle(`📊 Server Info: ${guild.name}`)
            .setThumbnail(guild.iconURL({ size: 512 }) || null)
            .setImage(guild.bannerURL({ size: 1024 }) || null) // Add banner if available
            .addFields(
                {
                    name: '🆔 Identification',
                    value: `> **ID:** \`${guild.id}\`\n> **Owner:** ${owner ? owner : 'Unknown'}`,
                    inline: false
                },
                {
                    name: '📅 History',
                    value: `> Created <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
                    inline: false
                },
                {
                    name: '👥 Membership',
                    value: `> **Total:** \`${guild.memberCount}\`\n> **Boosts:** \`${guild.premiumSubscriptionCount || 0}\` (Level ${guild.premiumTier})`,
                    inline: true
                },
                {
                    name: '💬 Channels',
                    value: `> **Total:** \`${totalChannels}\`\n> **Text:** \`${textChannels}\` | **Voice:** \`${voiceChannels}\``,
                    inline: true
                },
                {
                    name: '🎭 Assets',
                    value: `> **Roles:** \`${roles}\`\n> **Emojis:** \`${emojis}\`\n> **Stickers:** \`${guild.stickers.cache.size}\``,
                    inline: true
                }
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
