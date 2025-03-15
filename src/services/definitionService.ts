import axios from 'axios';
import { OpenAIAccessor } from '../accessor/openAIAccessor';
import { OPENAI_DEFINITION_PROMPT, OPENAI_MODEL } from '../config';

export class DefinitionService {
  public static async getDefinition(text: string): Promise<string> {
    return OpenAIAccessor.callOpenAI(OPENAI_DEFINITION_PROMPT, OPENAI_MODEL, text);
  }
}
