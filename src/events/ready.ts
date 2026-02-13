import { Events } from 'discord.js';
import { ExtendedClient } from '../types/client';
import { hibernateCheck } from '../database';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: ExtendedClient) {
        console.log(`✅ Logged in as ${client.user?.tag}!`);
        console.log(`📊 Serving ${client.guilds.cache.size} guilds`);

        // Wake up DB
        await hibernateCheck();

        // Keep-alive: Ping DB every 5 minutes to prevent hibernation while bot is online
        setInterval(async () => {
            await hibernateCheck();
        }, 1000 * 60 * 5);

        client.user?.setPresence({
            activities: [{
                name: `${client.guilds.cache.size} souls!`,
                type: 3,
                url: 'https://www.tiktok.com/@.juuleeee/live'
            }],
            status: 'dnd',
        });
    },
};
