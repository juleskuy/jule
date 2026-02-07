import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionResolvable } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder;
    category: 'moderation' | 'utility' | 'fun' | 'economy' | 'leveling' | 'admin';
    permissions?: PermissionResolvable[];
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
