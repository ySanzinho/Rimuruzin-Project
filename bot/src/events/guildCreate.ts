import { Guild } from 'discord.js';

module.exports = {
  name: 'guildCreate',
  async execute(guild: Guild) {
    console.log(`🤖 Fui adicionado no servidor: ${guild.name} (ID: ${guild.id})`);
    
    // Se quiser enviar uma mensagem no canal principal (se existir):
    const systemChannel = guild.systemChannel;
    if (systemChannel) {
      systemChannel.send('Olá! Obrigado por me adicionar! Use `/ping` para começar. 🚀');
    }
  },
};
