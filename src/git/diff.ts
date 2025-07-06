import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GitDiff {
  staged: string;
  unstaged: string;
  untracked: string[];
}

export async function getGitDiff(): Promise<GitDiff> {
  try {
    const [stagedDiff, unstagedDiff, untrackedFiles] = await Promise.all([
      getStagedDiff(),
      getUnstagedDiff(),
      getUntrackedFiles()
    ]);

    return {
      staged: stagedDiff,
      unstaged: unstagedDiff,
      untracked: untrackedFiles
    };
  } catch (error) {
    throw new Error(`Failed to get git diff: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function getStagedDiff(): Promise<string> {
  try {
    const { stdout } = await execAsync('git diff --cached');
    return stdout;
  } catch (error) {
    return '';
  }
}

async function getUnstagedDiff(): Promise<string> {
  try {
    const { stdout } = await execAsync('git diff');
    return stdout;
  } catch (error) {
    return '';
  }
}

async function getUntrackedFiles(): Promise<string[]> {
  try {
    const { stdout } = await execAsync('git ls-files --others --exclude-standard');
    return stdout.trim().split('\n').filter(file => file.length > 0);
  } catch (error) {
    return [];
  }
}

export async function isGitRepository(): Promise<boolean> {
  try {
    await execAsync('git rev-parse --git-dir');
    return true;
  } catch {
    return false;
  }
}

export async function getCurrentBranch(): Promise<string> {
  try {
    const { stdout } = await execAsync('git branch --show-current');
    return stdout.trim();
  } catch (error) {
    throw new Error('Failed to get current branch');
  }
}