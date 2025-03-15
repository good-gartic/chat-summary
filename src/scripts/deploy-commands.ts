import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN!;
const CLIENT_ID = process.env.CLIENT_ID!;
const GUILD_ID = process.env.GUILD_ID!;

const commands = [
  new SlashCommandBuilder()
    .setName('summary')
    .setDescription('Get a summary of the last N hours of messages.')
    .addIntegerOption((option) =>
      option.setName('hours').setDescription('Number of hours to summarize').setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName('define')
    .setDescription('Define a message or a word/sentence.')
    .addStringOption((option) =>
      option.setName('text').setDescription('The word or sentence to define').setRequired(false)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function registerCommands() {
  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

registerCommands();
