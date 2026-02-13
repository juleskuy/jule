import { Events, Message, EmbedBuilder } from 'discord.js';
import { getUserProfile, updateUserProfile, getGuildConfig } from '../database';

const cooldowns = new Map<string, number>();
const XP_COOLDOWN = 60000; // 1 minute
const XP_MIN = 15;
const XP_MAX = 25;
const XP_PER_LEVEL = 100;

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (message.author.bot || !message.guild) return;

        const config = await getGuildConfig(message.guild.id);
        if (!config.levelingEnabled) return;

        const key = `${message.guild.id}-${message.author.id}`;
        const now = Date.now();
        const cooldown = cooldowns.get(key);

        if (cooldown && now < cooldown) return;

        cooldowns.set(key, now + XP_COOLDOWN);

        const profile = await getUserProfile(message.guild.id, message.author.id);
        const xpGain = Math.floor(Math.random() * (XP_MAX - XP_MIN + 1)) + XP_MIN;
        const newXp = profile.xp + xpGain;
        const newLevel = Math.floor(newXp / XP_PER_LEVEL);

        await updateUserProfile(message.guild.id, message.author.id, {
            xp: newXp,
            level: newLevel,
        });

        if (newLevel > profile.level) {
            // Milestone badges
            let badge = '⭐';
            let milestone = '';
            if (newLevel === 100) { badge = '💯'; milestone = ' - LEGENDARY!'; }
            else if (newLevel === 75) { badge = '👑'; milestone = ' - MASTER!'; }
            else if (newLevel === 50) { badge = '💎'; milestone = ' - DIAMOND!'; }
            else if (newLevel === 25) { badge = '🏆'; milestone = ' - GOLD!'; }
            else if (newLevel === 10) { badge = '🥇'; milestone = ' - SILVER!'; }
            else if (newLevel % 10 === 0) { badge = '🎉'; }

            const embed = new EmbedBuilder()
                .setColor(newLevel >= 50 ? 0xffd700 : newLevel >= 25 ? 0x9b59b6 : newLevel >= 10 ? 0x3498db : 0x2ecc71)
                .setAuthor({ name: `Level Up!${milestone}`, iconURL: message.author.displayAvatarURL() })
                .setDescription(`${badge} ${message.author}, you've reached **Level ${newLevel}**!\n\nKeep chatting to earn more XP!`)
                .setThumbnail(message.author.displayAvatarURL({ size: 128 }))
                .setFooter({ text: `${newXp.toLocaleString()} total XP earned` })
                .setTimestamp();

            if (message.channel.isSendable()) {
                message.channel.send({ embeds: [embed] });
            }
        }
    },
};
