export interface GuildConfig {
    guildId: string;
    prefix: string;
    modLogChannel?: string;
    welcomeChannel?: string;
    goodbyeChannel?: string;
    autoRole?: string;
    mutedRole?: string;
}

export interface UserProfile {
    userId: string;
    guildId: string;
    level: number;
    xp: number;
    balance: number;
    lastDaily?: number;
    lastWork?: number;
}

export interface Warning {
    id: string;
    userId: string;
    guildId: string;
    moderatorId: string;
    reason: string;
    timestamp: number;
}

export interface ModerationCase {
    caseId: number;
    guildId: string;
    userId: string;
    moderatorId: string;
    action: 'warn' | 'kick' | 'ban' | 'mute' | 'unmute' | 'unban';
    reason: string;
    timestamp: number;
    duration?: number;
}

export interface TempMute {
    userId: string;
    guildId: string;
    endTime: number;
    roleId: string;
}

export interface Database {
    guilds: { [guildId: string]: GuildConfig };
    users: { [key: string]: UserProfile }; // key: `${guildId}-${userId}`
    warnings: Warning[];
    cases: { [guildId: string]: ModerationCase[] };
    tempMutes: TempMute[];
}
