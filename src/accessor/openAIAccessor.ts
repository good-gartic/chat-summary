import axios from 'axios';
import { OPENAI_API_KEY } from '../config';

export class OpenAIAccessor {
  public static async callOpenAI(prompt: string, model: string, content: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages: [
            {
              role: 'system',
              content: prompt,
            },
            { role: 'user', content },
          ],
        },
        { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return 'Error calling openAI API.';
    }
  }
}
