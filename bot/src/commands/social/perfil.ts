import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { buscarOuCriarUsuario } from '../../utils/api';
import { Command } from '../../types/Client';

const criarBarraDeProgresso = (xpAtual: number, xpMaximo: number, tamanho = 20): string => {
  const porcentagem = xpAtual / xpMaximo;
  const preenchido = Math.round(tamanho * porcentagem);
  const vazio = tamanho - preenchido;

  const barra = '🟦'.repeat(preenchido) + '⬜'.repeat(vazio);
  return `${barra} \`${xpAtual}/${xpMaximo}\``;
};

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Mostra seu perfil no Rimuruzin!'),

  async execute(interaction: ChatInputCommandInteraction) {
    const id = interaction.user.id;
    const user = await buscarOuCriarUsuario(id);

    const xpAtual = user.xp;
    const nivel = user.nivel;
    const moedas = user.moedas;
    const streak = user.streak;

    // XP necessário para o próximo nível (mesma fórmula do backend)
    const xpParaProximoNivel = 5 * nivel ** 2 + 50 * nivel + 100;
    const barra = criarBarraDeProgresso(xpAtual, xpParaProximoNivel);

    const embed = new EmbedBuilder()
      .setTitle(`👤 Perfil de ${interaction.user.username}`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setColor(0x00BFFF)
      .addFields(
        { name: '🎯 Nível', value: `\`${nivel}\``, inline: true },
        { name: '✨ XP', value: `\`${xpAtual}/${xpParaProximoNivel}\``, inline: true },
        { name: '🔥 Streak', value: `\`${streak} dias\``, inline: true },
        { name: '💰 Moedas', value: `\`${moedas}\``, inline: true },
        { name: '📊 Progresso', value: barra, inline: false },
      )
      .setDescription(user.sobremim || '📝 Nenhuma mensagem definida ainda.')
      .setFooter({ text: 'Continue interagindo para evoluir!' });

    await interaction.reply({ embeds: [embed]});
  }
};

export default command;