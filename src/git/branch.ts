import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function createBranch(branchName: string): Promise<void> {
  try {
    await execAsync(`git checkout -b ${branchName}`);
  } catch (error) {
    throw new Error(
      `Failed to create branch: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function branchExists(branchName: string): Promise<boolean> {
  try {
    await execAsync(`git show-ref --verify --quiet refs/heads/${branchName}`);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeBranchName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_/]/g, '')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 63);
}
