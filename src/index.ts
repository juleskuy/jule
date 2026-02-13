import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { ExtendedClient } from './types/client';
import { Command } from './types/command';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
    ],
}) as ExtendedClient;

client.commands = new Collection<string, Command>();

const loadCommands = () => {
    const commandsPath = path.join(__dirname, 'commands');
    const commandCategories = fs.readdirSync(commandsPath);

    for (const category of commandCategories) {
        const categoryPath = path.join(commandsPath, category);
        if (!fs.statSync(categoryPath).isDirectory()) continue;

        const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(categoryPath, file);
            const command: Command = require(filePath).default;

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                console.log(`✅ Loaded command: ${command.data.name}`);
            }
        }
    }
};

const loadEvents = () => {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath).default;

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`✅ Loaded event: ${event.name}`);
    }
};

loadCommands();
loadEvents();

// Health Check Server for Railway
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is running!');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 Health check server listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Shutting down gracefully...');
    client.destroy();
    server.close(() => {
        process.exit(0);
    });
});

client.login(process.env.BOT_TOKEN);
