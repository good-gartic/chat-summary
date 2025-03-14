import axios from 'axios';
import { Client } from 'discord.js';
import { encode } from 'gpt-3-encoder';
import { OPENAI_API_KEY, MILLISECONDS_IN_HOUR, OPENAI_PROMPT, OPENAI_MODEL, OPENAI_MAX_TOKENS } from './config';

interface Message {
  message_id: string;
  sender: string;
  content: string;
  reply_to?: string;
  attachments?: boolean;
}

export class SummaryService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async fetchMessages(channelId: string, hours: number): Promise<string> {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel?.isTextBased()) return '';

      const now = Date.now();
      const since = now - hours * MILLISECONDS_IN_HOUR;
      let messages: Message[] = [];
      let lastMessageId: string | undefined;
      let totalTokens = 0;

      while (true) {
        const fetched = await channel.messages.fetch({ limit: 100, before: lastMessageId });
        const filtered = fetched.filter((msg) => msg.createdTimestamp >= since && !msg.author.bot);
        if (filtered.size === 0) break;

        for (const msg of filtered.values()) {
          const message = this.createMessageObject(msg);
          const messageTokens = encode(JSON.stringify(message)).length;

          if (totalTokens + messageTokens > OPENAI_MAX_TOKENS) {
            break;
          }

          messages.push(message);
          totalTokens += messageTokens;
        }

        lastMessageId = fetched.last()?.id;
        if (!lastMessageId || totalTokens >= OPENAI_MAX_TOKENS) break;
      }

      return JSON.stringify(messages.reverse(), null, 2);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return '';
    }
  }

  private createMessageObject(msg: any): Message {
    const message: Message = {
      message_id: msg.id,
      sender: msg.member?.nickname || msg.author.username,
      content: msg.content,
    };
    if (msg.reference?.messageId) {
      message.reply_to = msg.reference.messageId;
    }
    if (msg.attachments.size > 0) {
      message.attachments = true;
    }
    return message;
  }

  public async generateSummary(messagesJson: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: OPENAI_PROMPT,
            },
            { role: 'user', content: messagesJson },
          ],
        },
        { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Error generating summary.';
    }
  }
}
