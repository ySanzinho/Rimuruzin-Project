import { Client } from 'discord.js';

export default {
    name: 'ready',
    once: true,
    execute(client: Client) {
        console.log(`[🤖] Bot está online como ${client.user?.tag}`);

        client.user?.setPresence({
            activities: [{ name: 'Programando em TypeScript!', type: 0 }], // 0 = PLAYING, 1 = STREAMING, 2 = LISTENING, 3 = WATCHING
            status: 'online', // online, idle, dnd, invisible
        });

        console.log(`[🟢] Status atualizado com sucesso.`)
    },
};