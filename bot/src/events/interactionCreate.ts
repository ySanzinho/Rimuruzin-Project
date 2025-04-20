// src/events/interactionCreate.ts
import {
  Interaction,
  CommandInteraction,
  ButtonInteraction,
  StringSelectMenuInteraction,
  ModalSubmitInteraction,
} from 'discord.js';
import { Command } from '../types/Client';

export default {
  name: 'interactionCreate',
  async execute(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = (interaction.client.commands as Map<string, Command>).get(interaction.commandName);

      if (!command) {
        console.error(`Nenhum comando encontrado com o nome ${interaction.commandName}.`);
        return;
      }

      try {
        if (interaction.isChatInputCommand()) {
          await command.execute(interaction);
        } else {
          console.warn(`O comando ${interaction.commandName} não é do tipo ChatInput.`);
        }
      } catch (error) {
        console.error(`Erro ao executar o comando ${interaction.commandName}:`, error);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ content: '❌ Houve um erro ao executar este comando!', ephemeral: true });
        }
      }
    }

    // Botões
    else if (interaction.isButton()) {
      const button = interaction as ButtonInteraction;
      console.log(`🟦 Botão clicado: ${button.customId}`);
      await button.reply({ content: `Você clicou no botão com ID: \`${button.customId}\``, ephemeral: true });
    }

    // Menus de seleção
    else if (interaction.isStringSelectMenu()) {
      const selectMenu = interaction as StringSelectMenuInteraction;
      console.log(`📋 Menu selecionado: ${selectMenu.customId} → ${selectMenu.values}`);
      await selectMenu.reply({
        content: `Você selecionou: \`${selectMenu.values.join(', ')}\` no menu \`${selectMenu.customId}\``,
        ephemeral: true,
      });
    }

    // Modais
    else if (interaction.isModalSubmit()) {
      const modal = interaction as ModalSubmitInteraction;
      console.log(`📝 Modal enviado: ${modal.customId}`);
      await modal.reply({ content: `Modal \`${modal.customId}\` recebido com sucesso!`, ephemeral: true });
    }
  },
};