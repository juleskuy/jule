import { JsonDatabase } from '../utils/jsonDb';
import { Database, GuildConfig, UserProfile, Warning, ModerationCase, TempMute } from '../types/database';

const defaultData: Database = {
    guilds: {},
    users: {},
    warnings: [],
    cases: {},
    tempMutes: []
};

export const db = new JsonDatabase<Database>('main.json', defaultData);

export function getGuildConfig(guildId: string): GuildConfig {
    const data = db.get();
    if (!data.guilds[guildId]) {
        data.guilds[guildId] = {
            guildId,
            prefix: '!'
        };
        db.set(data);
    }
    return data.guilds[guildId];
}

export function updateGuildConfig(guildId: string, update: Partial<GuildConfig>): void {
    db.update(data => {
        if (!data.guilds[guildId]) {
            data.guilds[guildId] = { guildId, prefix: '!' };
        }
        data.guilds[guildId] = { ...data.guilds[guildId], ...update };
        return data;
    });
}

export function getUserProfile(guildId: string, userId: string): UserProfile {
    const key = `${guildId}-${userId}`;
    const data = db.get();

    if (!data.users[key]) {
        data.users[key] = {
            userId,
            guildId,
            level: 0,
            xp: 0,
            balance: 0
        };
        db.set(data);
    }

    return data.users[key];
}

export function updateUserProfile(guildId: string, userId: string, update: Partial<UserProfile>): void {
    const key = `${guildId}-${userId}`;
    db.update(data => {
        if (!data.users[key]) {
            data.users[key] = { userId, guildId, level: 0, xp: 0, balance: 0 };
        }
        data.users[key] = { ...data.users[key], ...update };
        return data;
    });
}

export function addWarning(warning: Warning): void {
    db.update(data => {
        data.warnings.push(warning);
        return data;
    });
}

export function getUserWarnings(guildId: string, userId: string): Warning[] {
    const data = db.get();
    return data.warnings.filter(w => w.guildId === guildId && w.userId === userId);
}

export function addCase(modCase: ModerationCase): void {
    db.update(data => {
        if (!data.cases[modCase.guildId]) {
            data.cases[modCase.guildId] = [];
        }
        data.cases[modCase.guildId].push(modCase);
        return data;
    });
}

export function getNextCaseId(guildId: string): number {
    const data = db.get();
    const cases = data.cases[guildId] || [];
    return cases.length > 0 ? Math.max(...cases.map(c => c.caseId)) + 1 : 1;
}

export function addTempMute(mute: TempMute): void {
    db.update(data => {
        data.tempMutes.push(mute);
        return data;
    });
}

export function removeTempMute(guildId: string, userId: string): void {
    db.update(data => {
        data.tempMutes = data.tempMutes.filter(m => !(m.guildId === guildId && m.userId === userId));
        return data;
    });
}

export function getExpiredMutes(): TempMute[] {
    const data = db.get();
    const now = Date.now();
    return data.tempMutes.filter(m => m.endTime <= now);
}

export function getLeaderboard(guildId: string, limit: number = 10): UserProfile[] {
    const data = db.get();
    return Object.values(data.users)
        .filter(u => u.guildId === guildId)
        .sort((a, b) => b.level - a.level || b.xp - a.xp)
        .slice(0, limit);
}
