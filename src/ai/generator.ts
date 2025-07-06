import { GitDiff } from '../git/diff.js';
import { getOpenAIProvider } from './providers/openai.js';
import { getAnthropicProvider } from './providers/anthropic.js';
import { AIProvider } from './types.js';

const SYSTEM_PROMPT = `You are a git branch name generator. Based on the provided git diff, generate a concise, descriptive branch name.

Rules for branch names:
1. Use lowercase letters, numbers, hyphens, and forward slashes only
2. Start with a type prefix (feature/, fix/, refactor/, docs/, test/, chore/, etc.)
3. Be descriptive but concise (max 50 characters)
4. Use hyphens to separate words
5. Focus on the main change or feature

Respond with ONLY the branch name, no explanation or additional text.`;

export async function generateBranchName(
  diff: GitDiff,
  model?: string
): Promise<string> {
  const provider = await getAIProvider(model);

  const diffContent = formatDiff(diff);

  if (!diffContent) {
    throw new Error('No changes found to analyze');
  }

  const userPrompt = `Generate a git branch name based on these changes:\n\n${diffContent}`;

  const branchName = await provider.generate(SYSTEM_PROMPT, userPrompt);

  return branchName.trim();
}

function formatDiff(diff: GitDiff): string {
  const parts: string[] = [];

  if (diff.staged) {
    parts.push('=== STAGED CHANGES ===\n' + truncateDiff(diff.staged));
  }

  if (diff.unstaged) {
    parts.push('=== UNSTAGED CHANGES ===\n' + truncateDiff(diff.unstaged));
  }

  if (diff.untracked.length > 0) {
    parts.push('=== UNTRACKED FILES ===\n' + diff.untracked.join('\n'));
  }

  return parts.join('\n\n');
}

function truncateDiff(diff: string, maxLength: number = 3000): string {
  if (diff.length <= maxLength) {
    return diff;
  }

  return diff.substring(0, maxLength) + '\n... (truncated)';
}

async function getAIProvider(model?: string): Promise<AIProvider> {
  const modelName = model || 'gpt-3.5-turbo';

  if (modelName.startsWith('gpt') || modelName.includes('openai')) {
    return getOpenAIProvider();
  } else if (
    modelName.startsWith('claude') ||
    modelName.includes('anthropic')
  ) {
    return getAnthropicProvider();
  } else {
    return getOpenAIProvider();
  }
}
