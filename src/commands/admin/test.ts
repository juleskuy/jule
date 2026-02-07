import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { getGuildConfig } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test bot features')
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcome')
                .setDescription('Test the welcome message')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('goodbye')
                .setDescription('Test the goodbye message')
        ),
    category: 'admin',
    permissions: [PermissionFlagsBits.Administrator],
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const config = getGuildConfig(interaction.guildId!);

        if (subcommand === 'welcome') {
            if (!config.welcomeChannel) {
                return interaction.reply({
                    content: '❌ Welcome channel is not configured. Use `/config welcome #channel` to set it up.',
                    ephemeral: true,
                });
            }

            const channel = interaction.guild?.channels.cache.get(config.welcomeChannel);
            if (!channel?.isTextBased()) {
                return interaction.reply({
                    content: '❌ Welcome channel not found or is not a text channel.',
                    ephemeral: true,
                });
            }

            const memberCount = interaction.guild?.memberCount || 0;
            const createdAt = Math.floor(interaction.user.createdTimestamp / 1000);

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setAuthor({ name: `Welcome to ${interaction.guild?.name}!`, iconURL: interaction.guild?.iconURL() || undefined })
                .setDescription(`👋 Hey ${interaction.user}, welcome to the server!\n\nWe're glad to have you here! Make sure to read the rules and have fun!`)
                .setThumbnail(interaction.user.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: '👤 Member', value: `${interaction.user.tag}`, inline: true },
                    { name: '📅 Account Created', value: `<t:${createdAt}:R>`, inline: true },
                    { name: '👥 Member Count', value: `${memberCount.toLocaleString()}`, inline: true }
                )
                .setFooter({ text: `Member #${memberCount} • Enjoy your stay! • This is a test message` })
                .setTimestamp();

            await channel.send({ embeds: [embed] });

            await interaction.reply({
                content: `✅ Test welcome message sent to ${channel}!`,
                ephemeral: true,
            });
        } else if (subcommand === 'goodbye') {
            if (!config.goodbyeChannel) {
                return interaction.reply({
                    content: '❌ Goodbye channel is not configured. Use `/config goodbye #channel` to set it up.',
                    ephemeral: true,
                });
            }

            const channel = interaction.guild?.channels.cache.get(config.goodbyeChannel);
            if (!channel?.isTextBased()) {
                return interaction.reply({
                    content: '❌ Goodbye channel not found or is not a text channel.',
                    ephemeral: true,
                });
            }

            const memberCount = interaction.guild?.memberCount || 0;
            const member = interaction.guild?.members.cache.get(interaction.user.id);
            const joinedAt = member?.joinedTimestamp ? Math.floor(member.joinedTimestamp / 1000) : null;

            const embed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setAuthor({ name: `Goodbye, ${interaction.user.username}`, iconURL: interaction.guild?.iconURL() || undefined })
                .setDescription(`👋 **${interaction.user.tag}** has left the server.\n\n${joinedAt ? `They were with us for <t:${joinedAt}:R>` : 'We hope to see them again!'}\n\n*This is a test message*`)
                .setThumbnail(interaction.user.displayAvatarURL({ size: 128 }))
                .setFooter({ text: `${memberCount.toLocaleString()} members remaining` })
                .setTimestamp();

            await channel.send({ embeds: [embed] });

            await interaction.reply({
                content: `✅ Test goodbye message sent to ${channel}!`,
                ephemeral: true,
            });
        }
    },
} as Command;
