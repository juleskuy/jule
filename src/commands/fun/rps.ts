import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Command } from '../../types/command';

// Helper for RPS Logic
const CHOICES = [
    { name: 'Rock', value: 'rock', emoji: '🪨', beats: 'scissors' },
    { name: 'Paper', value: 'paper', emoji: '📄', beats: 'rock' },
    { name: 'Scissors', value: 'scissors', emoji: '✂️', beats: 'paper' }
];

export default {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock, Paper, Scissors')
        .addUserOption(option =>
            option.setName('opponent').setDescription('Challenge another user (leave empty for bot)').setRequired(false)
        ),
    category: 'fun',
    async execute(interaction: ChatInputCommandInteraction) {
        const opponent = interaction.options.getUser('opponent');

        // --- SINGLE PLAYER MODE (VS BOT) ---
        if (!opponent || opponent.id === interaction.client.user!.id) {
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🎮 Rock, Paper, Scissors')
                .setDescription('Select your move to play against me!');

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder().setCustomId('rps_rock').setLabel('Rock').setEmoji('🪨').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('rps_paper').setLabel('Paper').setEmoji('📄').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('rps_scissors').setLabel('Scissors').setEmoji('✂️').setStyle(ButtonStyle.Primary)
                );

            const response = await interaction.reply({ embeds: [embed], components: [row] });

            try {
                const confirmation = await response.awaitMessageComponent({
                    filter: i => i.user.id === interaction.user.id,
                    time: 30000
                });

                const userMoveVal = confirmation.customId.split('_')[1];
                const userMove = CHOICES.find(c => c.value === userMoveVal)!;
                const botMove = CHOICES[Math.floor(Math.random() * CHOICES.length)];

                // Calculate Result
                let resultTitle = '🤝 It\'s a Draw!';
                let resultDesc = 'We picked the same move!';
                let color = 0x95a5a6;

                if (userMove.value === botMove.value) {
                    // Tie
                } else if (userMove.beats === botMove.value) {
                    resultTitle = '🎉 You Win!';
                    resultDesc = `**${userMove.name}** beats **${botMove.name}**!`;
                    color = 0x2ecc71;
                } else {
                    resultTitle = '🤖 I Win!';
                    resultDesc = `**${botMove.name}** beats **${userMove.name}**!`;
                    color = 0xe74c3c;
                }

                const resultEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(resultTitle)
                    .setDescription(`
> **You:** ${userMove.emoji} ${userMove.name}
> **Me:** ${botMove.emoji} ${botMove.name}

${resultDesc}`)
                    .setFooter({ text: 'GG! Play again?', iconURL: interaction.client.user?.displayAvatarURL() })
                    .setTimestamp();

                await confirmation.update({ embeds: [resultEmbed], components: [] });

            } catch (e) {
                await interaction.editReply({ content: '⏱️ Game timed out!', embeds: [], components: [] });
            }
            return;
        }

        // --- MULTIPLAYER MODE (VS USER) ---
        if (opponent.bot) {
            return interaction.reply({ content: '🚫 You cannot challenge other bots!', ephemeral: true });
        }
        if (opponent.id === interaction.user.id) {
            return interaction.reply({ content: '🚫 You cannot play against yourself!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle('⚔️ RPS Challenge!')
            .setDescription(`${interaction.user} has challenged ${opponent} to a game of Rock, Paper, Scissors!\n\n**${opponent}, do you accept?**`)
            .setFooter({ text: 'You have 30 seconds to accept.' });

        const acceptRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder().setCustomId('accept').setLabel('Accept Challenge').setStyle(ButtonStyle.Success).setEmoji('✅'),
                new ButtonBuilder().setCustomId('decline').setLabel('Decline').setStyle(ButtonStyle.Danger).setEmoji('✖️')
            );

        const response = await interaction.reply({
            content: `${opponent}`,
            embeds: [embed],
            components: [acceptRow]
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000
        });

        let p1Move: string | null = null;
        let p2Move: string | null = null;
        let gameActive = false;

        collector.on('collect', async (i) => {
            // ACCEPTANCE PHASE
            if (!gameActive) {
                if (i.user.id !== opponent.id && i.user.id !== interaction.user.id) {
                    // Only challenge target can decline/accept, or challenger can cancel (optional, but usually challenger cancelling is good UX)
                    // Here we stick to target logic for simplicity
                    return i.reply({ content: '🚫 This challenge is not for you!', ephemeral: true });
                }

                // Allow challenger to cancel if they want? Nah, strict to prompt.
                // Actually good UX: Challenger can cancel.
                if (i.user.id === interaction.user.id && i.customId === 'decline') {
                    await i.update({ content: '❌ Challenge cancelled by challenger.', embeds: [], components: [] });
                    collector.stop();
                    return;
                }

                if (i.user.id !== opponent.id) {
                    return i.reply({ content: '🚫 Only the challenged user can decide!', ephemeral: true });
                }

                if (i.customId === 'decline') {
                    await i.update({ content: '❌ Challenge declined.', embeds: [], components: [] });
                    collector.stop();
                    return;
                }

                if (i.customId === 'accept') {
                    gameActive = true;
                    // Start Game UI
                    const gameEmbed = new EmbedBuilder()
                        .setColor(0x3498db)
                        .setTitle('🎮 Game On!')
                        .setDescription(`**${interaction.user.username}** vs **${opponent.username}**\n\nChoose your moves below! Selection is hidden.`);

                    const gameRow = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder().setCustomId('rock').setLabel('Rock').setEmoji('🪨').setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId('paper').setLabel('Paper').setEmoji('📄').setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId('scissors').setLabel('Scissors').setEmoji('✂️').setStyle(ButtonStyle.Secondary)
                        );

                    await i.update({ content: null, embeds: [gameEmbed], components: [gameRow] });
                }
                return;
            }

            // GAMEPLAY PHASE
            if (i.user.id !== interaction.user.id && i.user.id !== opponent.id) {
                return i.reply({ content: '🚫 You are not part of this game!', ephemeral: true });
            }

            // Check if already moved
            if (i.user.id === interaction.user.id && p1Move) {
                return i.reply({ content: '✅ You already selected your move!', ephemeral: true });
            }
            if (i.user.id === opponent.id && p2Move) {
                return i.reply({ content: '✅ You already selected your move!', ephemeral: true });
            }

            // Record Moves
            if (i.user.id === interaction.user.id) {
                p1Move = i.customId;
                await i.reply({ content: '✅ Move locked in!', ephemeral: true });
            } else if (i.user.id === opponent.id) {
                p2Move = i.customId;
                await i.reply({ content: '✅ Move locked in!', ephemeral: true });
            }

            // Check End Game (Both moved)
            if (p1Move && p2Move) {
                const m1 = CHOICES.find(c => c.value === p1Move)!;
                const m2 = CHOICES.find(c => c.value === p2Move)!;

                let finalTitle = '';
                let finalDesc = '';
                let finalColor = 0x95a5a6;

                if (m1.value === m2.value) {
                    finalTitle = '🤝 It\'s a Draw!';
                    finalDesc = 'Both players chose the same move!';
                } else if (m1.beats === m2.value) {
                    finalTitle = `🎉 ${interaction.user.username} Wins!`;
                    finalDesc = `**${m1.name}** beats **${m2.name}**!`;
                    finalColor = 0x2ecc71;
                } else {
                    finalTitle = `🎉 ${opponent.username} Wins!`;
                    finalDesc = `**${m2.name}** beats **${m1.name}**!`;
                    finalColor = 0x2ecc71;
                }

                const finalEmbed = new EmbedBuilder()
                    .setColor(finalColor)
                    .setTitle(finalTitle)
                    .setDescription(`
> **${interaction.user.username}:** ${m1.emoji} ${m1.name}
> **${opponent.username}:** ${m2.emoji} ${m2.name}

${finalDesc}
                    `)
                    .setTimestamp();

                await interaction.editReply({ embeds: [finalEmbed], components: [] });
                collector.stop();
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply({ content: '⏱️ Challenge timed out.', components: [] }).catch(() => { });
            }
        });
    },
} as Command;
