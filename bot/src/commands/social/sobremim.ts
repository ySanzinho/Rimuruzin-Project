// src/commands/sobremim.ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { atualizarSobreMim } from '../../utils/api';
import { Command } from '../../types/Client';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('sobremim')
    .setDescription('Atualize sua mensagem de "Sobre Mim" no perfil.')
    .addStringOption(option =>
      option.setName('texto')
        .setDescription('O que você quer mostrar no seu perfil?')
        .setRequired(true)
    ) as SlashCommandBuilder, // 👈 Força o tipo aqui

  async execute(interaction: ChatInputCommandInteraction) {
    const id = interaction.user.id;
    const texto = interaction.options.getString('texto', true);

    try {
      await atualizarSobreMim(id, texto);
      await interaction.reply({
        content: `✅ Sua mensagem "Sobre Mim" foi atualizada!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Erro ao atualizar "Sobre Mim":', error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao atualizar seu "Sobre Mim".',
        ephemeral: true,
      });
    }
  }
};

export default command;
