import { Events, GuildMember, EmbedBuilder } from 'discord.js';
import { getGuildConfig } from '../database';

export default {
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {
        const config = await getGuildConfig(member.guild.id);

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
                    .setTitle(`👋 Welcome to ${member.guild.name}!`)
                    .setDescription(`Hello ${member}, we're thrilled to have you here!\n\nPlease check out the rules and verify yourself to gain access to the rest of the server.`)
                    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
                    .addFields(
                        { name: '👤 Member Info', value: `> **Tag:** ${member.user.tag}\n> **ID:** ${member.user.id}`, inline: true },
                        { name: '📅 Account Age', value: `> Created <t:${createdAt}:R>`, inline: true },
                        { name: '📊 Server Stats', value: `> You are member #${memberCount}`, inline: false }
                    )
                    .setImage('https://media.discordapp.net/attachments/1206634502837305384/1206634685327278140/rainbow_line.gif?ex=65dcc0b3&is=65ca4bb3&hm=2a80603780373434606623635742337728472506307303733075677053530386&')
                    .setFooter({ text: `Welcome to the community! • Jule Bot`, iconURL: member.client.user?.displayAvatarURL() })
                    .setTimestamp();

                await channel.send({ embeds: [embed] });
            }
        }
    },
};
