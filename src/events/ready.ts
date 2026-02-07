import { Events } from 'discord.js';
import { ExtendedClient } from '../types/client';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: ExtendedClient) {
        console.log(`✅ Logged in as ${client.user?.tag}!`);
        console.log(`📊 Serving ${client.guilds.cache.size} guilds`);

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
