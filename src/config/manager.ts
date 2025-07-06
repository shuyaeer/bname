import { readFile, writeFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export interface Config {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  model?: string;
  language?: string;
  emoji?: boolean;
  maxLength?: number;
}

const CONFIG_FILE = join(homedir(), '.bname-config.json');
const LOCAL_CONFIG_FILE = '.bname-config.json';

const DEFAULT_CONFIG: Config = {
  model: 'gpt-4o-mini',
  language: 'en',
  emoji: false,
  maxLength: 50,
};

let cachedConfig: Config | null = null;

export async function getConfig(): Promise<Config> {
  if (cachedConfig) {
    return cachedConfig;
  }

  const envConfig = loadEnvConfig();
  const globalConfig = await loadJsonConfig(CONFIG_FILE);
  const localConfig = await loadJsonConfig(LOCAL_CONFIG_FILE);

  cachedConfig = {
    ...DEFAULT_CONFIG,
    ...globalConfig,
    ...localConfig,
    ...envConfig,
  };

  return cachedConfig;
}

export async function getAllConfig(): Promise<Config> {
  return getConfig();
}

export async function setConfig(key: string, value: string): Promise<void> {
  const config = await loadJsonConfig(CONFIG_FILE);

  let parsedValue: any = value;
  if (value === 'true') parsedValue = true;
  else if (value === 'false') parsedValue = false;
  else if (!isNaN(Number(value))) parsedValue = Number(value);

  config[key as keyof Config] = parsedValue;

  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
  cachedConfig = null;
}

async function loadJsonConfig(filePath: string): Promise<Partial<Config>> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function loadEnvConfig(): Partial<Config> {
  const config: Partial<Config> = {};

  if (process.env.OPENAI_API_KEY) {
    config.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  if (process.env.ANTHROPIC_API_KEY) {
    config.anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  }

  if (process.env.BNAME_MODEL) {
    config.model = process.env.BNAME_MODEL;
  }

  if (process.env.BNAME_LANGUAGE) {
    config.language = process.env.BNAME_LANGUAGE;
  }

  if (process.env.BNAME_EMOJI) {
    config.emoji = process.env.BNAME_EMOJI === 'true';
  }

  if (process.env.BNAME_MAX_LENGTH) {
    config.maxLength = parseInt(process.env.BNAME_MAX_LENGTH, 10);
  }

  return config;
}
