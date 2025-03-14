import dotenv from 'dotenv';

dotenv.config();

export const TOKEN: string =
  process.env.DISCORD_TOKEN ||
  (() => {
    throw new Error('DISCORD_TOKEN is not defined');
  })();
export const OPENAI_API_KEY: string =
  process.env.OPENAI_API_KEY ||
  (() => {
    throw new Error('OPENAI_API_KEY is not defined');
  })();
export const SUMMARY_CHANNEL_ID: string =
  process.env.SUMMARY_CHANNEL_ID ||
  (() => {
    throw new Error('SUMMARY_CHANNEL_ID is not defined');
  })();

export const MILLISECONDS_IN_HOUR = 3600000;
export const RATE_LIMIT_HOURS = 2;
export const SUMMARY_MAX_HOURS = 16;

export const OPENAI_PROMPT = `Summarize the following Discord chat for a member who is catching up after a few hours. 
          Break it down into subtopics and mention user names as bold.
          Keep the summary strictly under 1200 characters.`;
export const OPENAI_MODEL = 'gpt-4o-mini';
export const OPENAI_MAX_TOKENS = 50000;
