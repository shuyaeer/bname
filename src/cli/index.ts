#!/usr/bin/env node

import { Command } from 'commander';
import { createBranchCommand } from './commands/create.js';
import { configCommand } from './commands/config.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
interface PackageJson {
  version: string;
  [key: string]: unknown;
}

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
) as PackageJson;
const { version } = packageJson;

const program = new Command();

program
  .name('bname')
  .description('AI-powered git branch name generator based on your changes')
  .version(version);

program
  .command('create')
  .alias('c')
  .description(
    'Create a new branch with an AI-generated name based on git diff'
  )
  .option('-y, --yes', 'Skip confirmation prompt')
  .option('-m, --model <model>', 'AI model to use')
  .action(createBranchCommand);

program
  .command('config')
  .description('Configure bname settings')
  .argument('[action]', 'Action to perform (get, set, list)')
  .argument('[key]', 'Configuration key')
  .argument('[value]', 'Configuration value')
  .action(configCommand);

program.parse();

if (!process.argv.slice(2).length) {
  void createBranchCommand({ yes: false });
}
