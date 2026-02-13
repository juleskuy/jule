import prisma from './client';
import { GuildConfig, UserProfile, Warning, ModerationCase, TempMute } from '../types/database';

export async function getGuildConfig(guildId: string): Promise<GuildConfig> {
    const config = await prisma.guildConfig.findUnique({
        where: { guildId }
    });

    if (!config) {
        return await prisma.guildConfig.create({
            data: {
                guildId,
                levelingEnabled: false
            }
        });
    }

    return config as GuildConfig;
}

export async function updateGuildConfig(guildId: string, update: Partial<GuildConfig>): Promise<void> {
    await prisma.guildConfig.upsert({
        where: { guildId },
        update: update,
        create: {
            guildId,
            levelingEnabled: update.levelingEnabled ?? false,
            ...update
        }
    });
}

export async function getUserProfile(guildId: string, userId: string): Promise<UserProfile> {
    const profile = await prisma.userProfile.findUnique({
        where: {
            userId_guildId: { userId, guildId }
        }
    });

    if (!profile) {
        const newProfile = await prisma.userProfile.create({
            data: {
                userId,
                guildId,
                level: 0,
                xp: 0,
                balance: 0
            }
        });
        return mapUserProfile(newProfile);
    }

    return mapUserProfile(profile);
}

export async function updateUserProfile(guildId: string, userId: string, update: Partial<UserProfile>): Promise<void> {
    const data: any = { ...update };

    // Map number timestamps to BigInt for Prisma if they exist
    if (update.lastDaily) data.lastDaily = BigInt(update.lastDaily);
    if (update.lastWork) data.lastWork = BigInt(update.lastWork);
    if (update.lastRob) data.lastRob = BigInt(update.lastRob);
    if (update.inventory) data.inventory = update.inventory;

    await prisma.userProfile.upsert({
        where: {
            userId_guildId: { userId, guildId }
        },
        update: data,
        create: {
            userId,
            guildId,
            level: update.level ?? 0,
            xp: update.xp ?? 0,
            balance: update.balance ?? 0,
            ...data
        }
    });
}

export async function addWarning(warning: Warning): Promise<void> {
    await prisma.warning.create({
        data: {
            id: warning.id,
            userId: warning.userId,
            guildId: warning.guildId,
            moderatorId: warning.moderatorId,
            reason: warning.reason,
            timestamp: BigInt(warning.timestamp)
        }
    });
}

export async function getUserWarnings(guildId: string, userId: string): Promise<Warning[]> {
    const warnings = await prisma.warning.findMany({
        where: { guildId, userId }
    });
    return warnings.map(w => ({
        ...w,
        timestamp: Number(w.timestamp)
    }));
}

export async function addCase(modCase: ModerationCase): Promise<void> {
    await prisma.moderationCase.create({
        data: {
            caseId: modCase.caseId,
            guildId: modCase.guildId,
            userId: modCase.userId,
            moderatorId: modCase.moderatorId,
            action: modCase.action,
            reason: modCase.reason,
            timestamp: BigInt(modCase.timestamp),
            duration: modCase.duration
        }
    });
}

export async function getNextCaseId(guildId: string): Promise<number> {
    const lastCase = await prisma.moderationCase.findFirst({
        where: { guildId },
        orderBy: { caseId: 'desc' }
    });
    return lastCase ? lastCase.caseId + 1 : 1;
}

export async function addTempMute(mute: TempMute): Promise<void> {
    await prisma.tempMute.upsert({
        where: {
            userId_guildId: { userId: mute.userId, guildId: mute.guildId }
        },
        update: {
            endTime: BigInt(mute.endTime),
            roleId: mute.roleId
        },
        create: {
            userId: mute.userId,
            guildId: mute.guildId,
            endTime: BigInt(mute.endTime),
            roleId: mute.roleId
        }
    });
}

export async function removeTempMute(guildId: string, userId: string): Promise<void> {
    await prisma.tempMute.deleteMany({
        where: { guildId, userId }
    });
}

export async function getExpiredMutes(): Promise<TempMute[]> {
    const now = BigInt(Date.now());
    const mutes = await prisma.tempMute.findMany({
        where: {
            endTime: { lte: now }
        }
    });
    return mutes.map(m => ({
        ...m,
        endTime: Number(m.endTime)
    }));
}

export async function getLeaderboard(guildId: string, limit: number = 10): Promise<UserProfile[]> {
    const profiles = await prisma.userProfile.findMany({
        where: { guildId },
        orderBy: [
            { level: 'desc' },
            { xp: 'desc' }
        ],
        take: limit
    });
    return profiles.map(mapUserProfile);
}

export async function getRichList(guildId: string, limit: number = 10): Promise<UserProfile[]> {
    const profiles = await prisma.userProfile.findMany({
        where: { guildId },
        orderBy: { balance: 'desc' },
        take: limit
    });
    return profiles.map(mapUserProfile);
}

function mapUserProfile(p: any): UserProfile {
    return {
        userId: p.userId,
        guildId: p.guildId,
        level: p.level,
        xp: p.xp,
        balance: p.balance,
        lastDaily: p.lastDaily ? Number(p.lastDaily) : undefined,
        lastWork: p.lastWork ? Number(p.lastWork) : undefined,
        lastRob: p.lastRob ? Number(p.lastRob) : undefined,
        inventory: p.inventory as { [itemId: string]: number } | undefined
    };
}

/**
 * Database Warmup: Railway puts databases to sleep after inactivity.
 * This pings the DB during bot startup to wake it up.
 */
export async function hibernateCheck(): Promise<void> {
    console.log('🔄 [Database] Waking up database...');
    try {
        // Simple light query to wake up Postgres
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ [Database] Connection established and database is awake.');
    } catch (error) {
        console.error('❌ [Database] Failed to wake up database:', error);
    }
}
