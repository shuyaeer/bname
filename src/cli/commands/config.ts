import chalk from 'chalk';
import { getConfig, setConfig, getAllConfig } from '../../config/manager.js';

export async function configCommand(action?: string, key?: string, value?: string) {
  try {
    if (!action || action === 'list') {
      const config = await getAllConfig();
      console.log(chalk.cyan('Current configuration:'));
      Object.entries(config).forEach(([k, v]) => {
        console.log(`  ${chalk.gray(k)}: ${chalk.white(JSON.stringify(v))}`);
      });
      return;
    }

    if (action === 'get') {
      if (!key) {
        console.error(chalk.red('Error: Key required for get action'));
        process.exit(1);
      }
      const config = await getConfig();
      const value = config[key as keyof typeof config];
      if (value !== undefined) {
        console.log(`${chalk.gray(key)}: ${chalk.white(JSON.stringify(value))}`);
      } else {
        console.log(chalk.yellow(`Key '${key}' not found`));
      }
      return;
    }

    if (action === 'set') {
      if (!key || value === undefined) {
        console.error(chalk.red('Error: Key and value required for set action'));
        process.exit(1);
      }
      await setConfig(key, value);
      console.log(chalk.green('✓'), `Set ${chalk.gray(key)} to ${chalk.white(value)}`);
      return;
    }

    console.error(chalk.red(`Unknown action: ${action}`));
    console.log('Available actions: get, set, list');
    process.exit(1);

  } catch (error) {
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}