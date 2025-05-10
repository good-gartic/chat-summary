import { OpenAIAccessor } from '../accessor/openAIAccessor';
import {
  LLM_QUERY_TYPE,
  OPENAI_ANSWER_PROMPT,
  OPENAI_DEFINITION_PROMPT,
  OPENAI_EXPLAIN_PROMPT,
  OPENAI_MODEL,
  OPENAI_TRANSLATE_PROMPT,
} from '../config';

export class LLMService {
  public static async getLLMResponse(text: string, queryType: LLM_QUERY_TYPE): Promise<string> {
    switch (queryType) {
      case LLM_QUERY_TYPE.EXPLAIN:
        return OpenAIAccessor.callOpenAI(OPENAI_EXPLAIN_PROMPT, OPENAI_MODEL, text);
      case LLM_QUERY_TYPE.DEFINE:
        return OpenAIAccessor.callOpenAI(OPENAI_DEFINITION_PROMPT, OPENAI_MODEL, text);
      case LLM_QUERY_TYPE.TRANSLATE:
        return OpenAIAccessor.callOpenAI(OPENAI_TRANSLATE_PROMPT, OPENAI_MODEL, text);
      case LLM_QUERY_TYPE.ANSWER:
        return OpenAIAccessor.callOpenAI(OPENAI_ANSWER_PROMPT, OPENAI_MODEL, text);
      default:
        throw new Error('Invalid query type');
    }
  }
}
