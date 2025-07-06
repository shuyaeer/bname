import chalk from 'chalk';
import inquirer from 'inquirer';
import { getGitDiff, isGitRepository, getCurrentBranch } from '../../git/diff.js';
import { createBranch, branchExists, sanitizeBranchName } from '../../git/branch.js';
import { generateBranchName } from '../../ai/generator.js';
import { getConfig } from '../../config/manager.js';
import { spinner } from '../../utils/spinner.js';

interface CreateOptions {
  yes?: boolean;
  model?: string;
}

export async function createBranchCommand(options: CreateOptions) {
  try {
    if (!await isGitRepository()) {
      console.error(chalk.red('Error: Not a git repository'));
      process.exit(1);
    }

    const currentBranch = await getCurrentBranch();
    console.log(chalk.gray(`Current branch: ${currentBranch}`));

    const spin = spinner('Analyzing git diff...');
    spin.start();

    const diff = await getGitDiff();
    
    if (!diff.staged && !diff.unstaged && diff.untracked.length === 0) {
      spin.stop();
      console.error(chalk.yellow('No changes detected. Make some changes first!'));
      process.exit(0);
    }

    spin.text = 'Generating branch name...';
    
    const config = await getConfig();
    const model = options.model || config.model;
    
    const suggestedName = await generateBranchName(diff, model);
    const sanitizedName = await sanitizeBranchName(suggestedName);
    
    spin.stop();
    
    console.log(chalk.green('✓ Suggested branch name:'), chalk.cyan(sanitizedName));

    let finalBranchName = sanitizedName;

    if (!options.yes) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'branchName',
          message: 'Branch name:',
          default: sanitizedName,
          validate: async (input) => {
            if (!input.trim()) {
              return 'Branch name cannot be empty';
            }
            if (await branchExists(input)) {
              return `Branch '${input}' already exists`;
            }
            return true;
          }
        },
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Create this branch?',
          default: true
        }
      ]);

      if (!answers.confirm) {
        console.log(chalk.yellow('Branch creation cancelled'));
        process.exit(0);
      }

      finalBranchName = await sanitizeBranchName(answers.branchName);
    }

    if (await branchExists(finalBranchName)) {
      console.error(chalk.red(`Branch '${finalBranchName}' already exists`));
      process.exit(1);
    }

    await createBranch(finalBranchName);
    console.log(chalk.green('✓ Branch created:'), chalk.cyan(finalBranchName));

  } catch (error) {
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}