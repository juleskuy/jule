import { Events, GuildMember, EmbedBuilder } from 'discord.js';
import { getGuildConfig } from '../database';

export default {
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {
        const config = getGuildConfig(member.guild.id);

        if (config.autoRole) {
            try {
                const role = member.guild.roles.cache.get(config.autoRole);
                if (role) {
                    await member.roles.add(role);
                }
            } catch (error) {
                console.error('Error adding auto role:', error);
            }
        }

        if (config.welcomeChannel) {
            const channel = member.guild.channels.cache.get(config.welcomeChannel);
            if (channel?.isTextBased()) {
                const memberCount = member.guild.memberCount;
                const createdAt = Math.floor(member.user.createdTimestamp / 1000);

                const embed = new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setAuthor({ name: `Welcome to ${member.guild.name}!`, iconURL: member.guild.iconURL() || undefined })
                    .setDescription(`👋 Hey ${member}, welcome to the server!\n\nWe're glad to have you here! Make sure to read the rules and have fun!`)
                    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
                    .addFields(
                        { name: '👤 Member', value: `${member.user.tag}`, inline: true },
                        { name: '📅 Account Created', value: `<t:${createdAt}:R>`, inline: true },
                        { name: '👥 Member Count', value: `${memberCount.toLocaleString()}`, inline: true }
                    )
                    .setFooter({ text: `Member #${memberCount} • Enjoy your stay!` })
                    .setTimestamp();

                await channel.send({ embeds: [embed] });
            }
        }
    },
};
