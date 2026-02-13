import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { AttachmentBuilder, User } from 'discord.js';

// If you want to use custom fonts, you can load them here.
// GlobalFonts.registerFromPath('./assets/fonts/Roboto-Regular.ttf', 'Roboto');

interface RankCardData {
    user: User;
    level: number;
    currentXp: number;
    requiredXp: number;
    rank: number;
    backgroundColor?: string;
}

export async function createRankCard(data: RankCardData): Promise<AttachmentBuilder> {
    const canvas = createCanvas(934, 282);
    const ctx = canvas.getContext('2d');

    const { user, level, currentXp, requiredXp, rank } = data;

    // --- Background ---
    ctx.fillStyle = '#23272A'; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add a gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#2C2F33');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    // --- Progress Bar Background ---
    const barX = 250;
    const barY = 180;
    const barWidth = 600; // ample width
    const barHeight = 40;
    const radius = 20;

    // Draw empty bar
    ctx.beginPath();
    ctx.fillStyle = '#484b4e';
    ctx.roundRect(barX, barY, barWidth, barHeight, radius);
    ctx.fill();

    // --- Progress Bar Logic ---
    // Make sure we don't draw negative width
    const percentage = Math.min(Math.max(currentXp / requiredXp, 0), 1);
    const progressWidth = barWidth * percentage;

    // Draw filled bar
    ctx.beginPath();
    ctx.fillStyle = '#00ff9d'; // Nice green color
    // If progress is very small, we might want a minimum checks, but roundRect handles it okay usually
    // However, if width < radius * 2, roundRect might look weird or fail in some implementations.
    // For simplicity, we just draw it if width > 0
    if (progressWidth > 0) {
        ctx.roundRect(barX, barY, progressWidth, barHeight, radius);
        ctx.fill();
    }

    // --- Text: XP ---
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    const xpText = `${currentXp.toLocaleString()} / ${requiredXp.toLocaleString()} XP`;
    ctx.fillText(xpText, barX + barWidth, barY - 10);

    // --- Text: Level & Rank ---
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Rank #${rank}`, barX, barY - 50);

    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#00ff9d'; // Match progress bar
    const levelText = `Level ${level}`;
    // Measure text to position it properly if we want
    const levelWidth = ctx.measureText(levelText).width;
    ctx.fillText(levelText, barX + 180, barY - 50); // Offset from Rank

    // --- Text: Username ---
    ctx.font = 'bold 50px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    // Use display name or username
    const name = user.username.length > 15 ? user.username.substring(0, 15) + '...' : user.username;
    ctx.fillText(name, barX, 100);

    // --- Discriminator (Optional, users barely have them now) ---
    // ctx.font = '30px sans-serif';
    // ctx.fillStyle = '#7f8c8d';
    // ctx.fillText(`#${user.discriminator}`, barX + ctx.measureText(name).width + 10, 100);

    // --- Avatar ---
    // Load avatar
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 256 });
    try {
        const avatar = await loadImage(avatarURL);

        // Circular mask
        const avatarSize = 180;
        const avatarX = 40;
        const avatarY = (canvas.height - avatarSize) / 2;

        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.save(); // Save context before clipping
        ctx.clip();

        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore(); // Restore context to stop clipping

        // Optional: Circle border
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth = 4;
        ctx.stroke();

    } catch (err) {
        console.error('Failed to load avatar:', err);
    }

    return new AttachmentBuilder(await canvas.encode('png'), { name: 'rank-card.png' });
}
