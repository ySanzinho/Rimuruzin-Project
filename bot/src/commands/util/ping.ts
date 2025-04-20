// src/commands/util/ping.ts
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/Client';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong e mostra o ping atual do bot.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: '🏓 Pingando...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;

    await interaction.editReply(`🏓 Pong! Latência: \`${latency}ms\` | API: \`${apiPing}ms\``);
  }
};

export default command;
