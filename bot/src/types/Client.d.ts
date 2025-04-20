// src/types/Client.d.ts
import { Client, Collection } from 'discord.js';
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder; // Define o tipo de data como SlashCommandBuilder ou SlashCommandSubcommandsOnlyBuilder 
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
  }
}

// 👇 Isso é essencial pra que o arquivo seja tratado como módulo
export {};
// Isso permite que o TypeScript reconheça o arquivo como um módulo e não como um script global