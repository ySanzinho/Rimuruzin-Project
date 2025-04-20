import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Command } from './types/Client';

dotenv.config();

// Criação do client com intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Estendendo o client com Collection de comandos
client.commands = new Collection<string, Command>();

// Função async principal
(async () => {
  // Carregar os comandos
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.existsSync(foldersPath)
    ? fs.readdirSync(foldersPath)
    : [];

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      const cmd = command?.default;
      
      if (cmd?.data && cmd?.execute) {
        client.commands.set(cmd.data.name, cmd);
        console.log(`✅ Comando carregado: ${cmd.data.name}`);
      } else {
        console.warn(`[AVISO] O comando em ${filePath} está incompleto ou mal formatado.`);
      }
    }
  }

  // Carregar os eventos
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs.existsSync(eventsPath)
    ? fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'))
    : [];

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    if (event.default?.once) {
      client.once(event.default.name, (...args) => event.default.execute(...args, client));
    } else {
      client.on(event.default.name, (...args) => event.default.execute(...args, client));
    }
  }

  // Login no bot
  client.login(process.env.DISCORD_TOKEN).catch(err => {
    console.error('Erro ao logar no Discord:', err);
  });
})();
