export interface GuildConfig {
    guildId: string;
    modLogChannel?: string | null;
    welcomeChannel?: string | null;
    goodbyeChannel?: string | null;
    autoRole?: string | null;
    mutedRole?: string | null;
    levelingEnabled?: boolean;
    joinToCreateChannelId?: string | null;
    ticketCategoryId?: string | null;
    ticketTranscriptChannelId?: string | null;
}

export interface UserProfile {
    userId: string;
    guildId: string;
    level: number;
    xp: number;
    balance: number;
    lastDaily?: number | null;
    lastWork?: number | null;
    lastRob?: number | null;
    inventory?: { [itemId: string]: number } | null | any;
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
    action: string;
    reason: string;
    timestamp: number;
    duration?: number | null;
}

export interface TempMute {
    userId: string;
    guildId: string;
    endTime: number;
    roleId: string;
}

export interface Database {
    guilds: { [guildId: string]: GuildConfig };
    users: { [key: string]: UserProfile };
    warnings: Warning[];
    cases: { [guildId: string]: ModerationCase[] };
    tempMutes: TempMute[];
}
