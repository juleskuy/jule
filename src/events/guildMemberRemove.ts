import { Events, GuildMember, EmbedBuilder } from 'discord.js';
import { getGuildConfig } from '../database';

export default {
    name: Events.GuildMemberRemove,
    async execute(member: GuildMember) {
        const config = await getGuildConfig(member.guild.id);

        if (config.goodbyeChannel) {
            const channel = member.guild.channels.cache.get(config.goodbyeChannel);
            if (channel?.isTextBased()) {
                const memberCount = member.guild.memberCount;
                const joinedAt = member.joinedTimestamp ? Math.floor(member.joinedTimestamp / 1000) : Math.floor(Date.now() / 1000);

                const embed = new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle(`👋 Goodbye, ${member.user.username}`)
                    .setDescription(`It's sad to see you go! We hope you enjoyed your stay at **${member.guild.name}**.`)
                    .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
                    .addFields(
                        { name: '👤 Member Left', value: `> **${member.user.tag}**`, inline: true },
                        { name: '⏳ Stayed For', value: `> Joined <t:${joinedAt}:R>`, inline: true },
                        { name: '📉 Member Count', value: `> We now have ${memberCount} members`, inline: false }
                    )
                    .setImage('https://media.discordapp.net/attachments/1206634502837305384/1206634685327278140/rainbow_line.gif?ex=65dcc0b3&is=65ca4bb3&hm=2a80603780373434606623635742337728472506307303733075677053530386&')
                    .setFooter({ text: `Goodbye! • Jule Bot`, iconURL: member.client.user?.displayAvatarURL() })
                    .setTimestamp();

                await channel.send({ embeds: [embed] });
            }
        }
    },
};
