import { Events, GuildMember, EmbedBuilder } from 'discord.js';
import { getGuildConfig } from '../database';

export default {
    name: Events.GuildMemberRemove,
    async execute(member: GuildMember) {
        const config = getGuildConfig(member.guild.id);

        if (config.goodbyeChannel) {
            const channel = member.guild.channels.cache.get(config.goodbyeChannel);
            if (channel?.isTextBased()) {
                const memberCount = member.guild.memberCount;
                const joinedAt = member.joinedTimestamp ? Math.floor(member.joinedTimestamp / 1000) : null;

                const embed = new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setAuthor({ name: `Goodbye, ${member.user.username}`, iconURL: member.guild.iconURL() || undefined })
                    .setDescription(`👋 **${member.user.tag}** has left the server.\n\n${joinedAt ? `They were with us for <t:${joinedAt}:R>` : 'We hope to see them again!'}`)
                    .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
                    .setFooter({ text: `${memberCount.toLocaleString()} members remaining` })
                    .setTimestamp();

                await channel.send({ embeds: [embed] });
            }
        }
    },
};
