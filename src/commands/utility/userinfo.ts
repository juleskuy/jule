import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';

export default {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Display information about a user')
        .addUserOption(option =>
            option.setName('user').setDescription('The user to get information about').setRequired(false)
        ),
    category: 'utility',
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild?.members.cache.get(user.id);

        // Fetch user to get banner/accent color if possible (requires intent/API call usually, we stick to basic)
        // const fetchedUser = await user.fetch(); // Can fail or rate limit, stick to basic 'user' object for now unless critical

        const embed = new EmbedBuilder()
            .setColor(member?.displayColor || 0x2b2d31)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 512 }))
            .addFields(
                { name: '👤 Identity', value: `> **ID:** \`${user.id}\`\n> **Mention:** ${user}`, inline: true },
                { name: '📅 Account Age', value: `> Created <t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
            );

        if (member) {
            embed.addFields(
                { name: '📥 Server Join', value: `> Joined <t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`, inline: false },
                {
                    name: `🎭 Roles [${member.roles.cache.size - 1}]`, // -1 for @everyone
                    value: member.roles.cache
                        .filter(r => r.id !== interaction.guild?.id)
                        .sort((a, b) => b.position - a.position)
                        .map(r => r.toString())
                        .slice(0, 5) // Show top 5 roles
                        .join(', ') + (member.roles.cache.size > 6 ? ` ...and ${member.roles.cache.size - 6} more` : '') || 'No roles',
                    inline: false
                }
            );

            if (member.premiumSince) {
                embed.addFields({ name: '💎 Server Booster', value: `> Since <t:${Math.floor(member.premiumSinceTimestamp! / 1000)}:R>`, inline: false });
            }
        }

        embed.setFooter({ text: 'Jule User Directory' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
