import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { buscarOuCriarUsuario, adicionarXP, adicionarMoedas, atualizarStreak } from '../../utils/api';
import { Command } from '../../types/Client';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Coleta diária de moedas e XP!'),

  async execute(interaction: ChatInputCommandInteraction) {
    const id = interaction.user.id;

    // 🔍 Busca dados do usuário
    const user = await buscarOuCriarUsuario(id);
    const hoje = new Date();
    const ultima = new Date(user.ultimaDiaria);
    const horasPassadas = (hoje.getTime() - ultima.getTime()) / (1000 * 60 * 60);

    // Já coletou hoje?
    if (ultima.toDateString() === hoje.toDateString()) {
      await interaction.reply({
        content: '⚠️ Você já coletou sua diária hoje!',
        ephemeral: true,
      });
      return;
    }

    // 🔁 Define novo streak
    let novaStreak = 1;
    if (horasPassadas <= 24 && ultima.toDateString() === new Date(hoje.getTime() - 86400000).toDateString()) {
      novaStreak = user.streak + 1;
    }

    // 💎 Bônus a cada 3 dias
    let bonusMoedas = 0;
    let bonusMsg = '';
    if (novaStreak % 3 === 0) {
      bonusMoedas = 500;
      bonusMsg = `\n🎁 Bônus de streak! Você ganhou \`${bonusMoedas}\` moedas extras!`;
    }

    // 🎁 Recompensas
    const moedas = 100 + novaStreak * 10 + bonusMoedas;
    const xp = 50 + novaStreak * 5;

    try {
      await adicionarMoedas(id, moedas);
      await adicionarXP(id, xp);
      await atualizarStreak(id, novaStreak, hoje.toISOString());

      await interaction.reply({
        content: `✅ Você coletou sua diária!\n\n🔥 **Streak atual:** \`${novaStreak} dias\`\n💰 **Moedas:** \`${moedas}\`\n✨ **XP:** \`${xp}\`${bonusMsg}`,
        ephemeral: true,
      });

    } catch (error) {
      console.error('Erro ao aplicar recompensas diárias:', error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao tentar coletar sua diária. Tente novamente mais tarde.',
        ephemeral: true,
      });
    }
  }
};

export default command;