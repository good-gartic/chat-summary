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

export const OPENAI_SUMMARY_PROMPT = `Summarize the following Discord chat for a member who is catching up after a few hours. 
          Break it down into subtopics and mention user names as bold.
          Keep the summary strictly under 1200 characters.`;
export const OPENAI_DEFINITION_PROMPT = `Given a sentence, define the key terms/phrases in it using simple and conscise language. 
          Also define any complex words or abbreviations. Skip common words.
          Use the format: "**<Word/Phrase>**: <definition>" (If there are multilple make a list, use \\n\\n as delimiter).`;
export const OPENAI_TRANSLATE_PROMPT = `Translate the given text to English.
          Keep the translation simple and precise. Also, mention the language of the original text. 
          Use the format: "**Language**: <language name>\\n\\n**Translation**: <translation>".`;
export const OPENAI_ANSWER_PROMPT = `Answer the question/query.
          Keep the answer simple and to the point.`;
export const OPENAI_EXPLAIN_PROMPT = `Explain the meaning of the given text message. Even if it is a question,
          explain the meaning instead of answering it.
          Use short, simple, clear language to help the user understand it easily.`;
export const OPENAI_MODEL = 'gpt-4o-mini';
export const OPENAI_MAX_TOKENS = 50000;
export enum LLM_QUERY_TYPE {
  EXPLAIN = 'explain',
  DEFINE = 'define',
  TRANSLATE = 'translate',
  ANSWER = 'answer',
}
