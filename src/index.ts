import { DiscordBot } from './discordBot';
import dotenv from 'dotenv';

dotenv.config();

const bot = new DiscordBot();
bot.start();
