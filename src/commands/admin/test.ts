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
        const guild = interaction.guild;
        const user = interaction.user;

        // Visual Assets
        const botAvatar = interaction.client.user?.displayAvatarURL();
        const userAvatar = user.displayAvatarURL();

        if (subcommand === 'welcome') {
            if (!config.welcomeChannel) {
                return interaction.reply({
                    content: '🚫 **Welcome channel is not configured.**\nUse `/config welcome` to set it up first.',
                    ephemeral: true,
                });
            }

            const channel = guild?.channels.cache.get(config.welcomeChannel);
            if (!channel?.isTextBased()) {
                return interaction.reply({
                    content: '🚫 **Invalid welcome channel.**\nThe configured channel may have been deleted or is not text-based.',
                    ephemeral: true,
                });
            }

            // Simulate Welcome Message
            const memberCount = guild?.memberCount || 0;
            const createdAt = Math.floor(user.createdTimestamp / 1000);

            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle(`👋 Welcome to ${guild?.name}!`)
                .setDescription(`Hello ${user}, we're thrilled to have you here!\n\nPlease check out the rules and verify yourself to gain access to the rest of the server.`)
                .setThumbnail(userAvatar)
                .addFields(
                    { name: '👤 Member Info', value: `> **Tag:** ${user.tag}\n> **ID:** ${user.id}`, inline: true },
                    { name: '📅 Account Age', value: `> Created <t:${createdAt}:R>`, inline: true },
                    { name: '📊 Server Stats', value: `> You are member #${memberCount}`, inline: false }
                )
                .setImage('https://media.discordapp.net/attachments/1206634502837305384/1206634685327278140/rainbow_line.gif?ex=65dcc0b3&is=65ca4bb3&hm=2a80603780373434606623635742337728472506307303733075677053530386&') // Optional aesthetic line
                .setFooter({ text: `Welcome to the community! • Jule Bot`, iconURL: botAvatar })
                .setTimestamp();

            // Send to channel
            await channel.send({ content: `Welcome ${user}!`, embeds: [welcomeEmbed] });

            // Reply to command
            await interaction.reply({
                content: `✅ **Test Successful!**\nA sample welcome message has been sent to ${channel}.`,
                ephemeral: true,
            });

        } else if (subcommand === 'goodbye') {
            if (!config.goodbyeChannel) {
                return interaction.reply({
                    content: '🚫 **Goodbye channel is not configured.**\nUse `/config goodbye` to set it up first.',
                    ephemeral: true,
                });
            }

            const channel = guild?.channels.cache.get(config.goodbyeChannel);
            if (!channel?.isTextBased()) {
                return interaction.reply({
                    content: '🚫 **Invalid goodbye channel.**\nThe configured channel may have been deleted or is not text-based.',
                    ephemeral: true,
                });
            }

            // Simulate Goodbye Message
            const memberCount = (guild?.memberCount || 0) - 1; // Simulate one less
            const member = guild?.members.cache.get(user.id);
            const joinedAt = member?.joinedTimestamp ? Math.floor(member.joinedTimestamp / 1000) : Math.floor(Date.now() / 1000);

            const goodbyeEmbed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle(`👋 Goodbye, ${user.username}`)
                .setDescription(`It's sad to see you go! We hope you enjoyed your stay at **${guild?.name}**.`)
                .setThumbnail(userAvatar)
                .addFields(
                    { name: '👤 Member Left', value: `> **${user.tag}**`, inline: true },
                    { name: '⏳ Stayed For', value: `> Joined <t:${joinedAt}:R>`, inline: true },
                    { name: '📉 Member Count', value: `> We now have ${memberCount} members`, inline: false }
                )
                .setImage('https://media.discordapp.net/attachments/1206634502837305384/1206634685327278140/rainbow_line.gif?ex=65dcc0b3&is=65ca4bb3&hm=2a80603780373434606623635742337728472506307303733075677053530386&') // Optional aesthetic line
                .setFooter({ text: `Goodbye! • Jule Bot`, iconURL: botAvatar })
                .setTimestamp();

            // Send to channel
            await channel.send({ embeds: [goodbyeEmbed] });

            // Reply to command
            await interaction.reply({
                content: `✅ **Test Successful!**\nA sample goodbye message has been sent to ${channel}.`,
                ephemeral: true,
            });
        }
    },
} as Command;
