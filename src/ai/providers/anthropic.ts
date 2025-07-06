import Anthropic from '@anthropic-ai/sdk';
import { AIProvider } from '../types.js';
import { getConfig } from '../../config/manager.js';

export async function getAnthropicProvider(): Promise<AIProvider> {
  const config = await getConfig();
  
  if (!config.anthropicApiKey) {
    throw new Error('Anthropic API key not configured. Run: bname config set anthropicApiKey YOUR_API_KEY');
  }

  const anthropic = new Anthropic({
    apiKey: config.anthropicApiKey,
  });

  return {
    async generate(systemPrompt: string, userPrompt: string): Promise<string> {
      try {
        const response = await anthropic.messages.create({
          model: config.model || 'claude-3-haiku-20240307',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 100,
          temperature: 0.7,
        });

        const content = response.content[0];
        return content.type === 'text' ? content.text : '';
      } catch (error) {
        throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };
}