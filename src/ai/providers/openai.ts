import OpenAI from 'openai';
import { AIProvider } from '../types.js';
import { getConfig } from '../../config/manager.js';

export async function getOpenAIProvider(): Promise<AIProvider> {
  const config = await getConfig();

  if (!config.openaiApiKey) {
    throw new Error(
      'OpenAI API key not configured. Run: bname config set openaiApiKey YOUR_API_KEY'
    );
  }

  const openai = new OpenAI({
    apiKey: config.openaiApiKey,
  });

  return {
    async generate(systemPrompt: string, userPrompt: string): Promise<string> {
      try {
        const response = await openai.chat.completions.create({
          model: config.model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 100,
        });

        return response.choices[0]?.message?.content || '';
      } catch (error) {
        throw new Error(
          `OpenAI API error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
  };
}
