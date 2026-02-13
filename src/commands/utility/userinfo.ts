import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Display information about a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to get information about')
                .setRequired(false)
        ),
    category: 'utility',
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild?.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle(`${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ size: 256 }))
            .addFields(
                { name: '👤 Username', value: `\`${user.username}\``, inline: true },
                { name: '🆔 User ID', value: `\`${user.id}\``, inline: true },
                { name: '📅 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
            );

        if (member) {
            embed.addFields(
                { name: '📥 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`, inline: true },
                { name: '🎭 Roles', value: member.roles.cache.filter(r => r.id !== interaction.guild?.id).map(r => r.toString()).join(', ') || 'None', inline: false },
                { name: '🎨 Display Color', value: member.displayHexColor, inline: true }
            );
        }

        embed.setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
