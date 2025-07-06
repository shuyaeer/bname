import chalk from 'chalk';

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export interface Spinner {
  start: () => void;
  stop: () => void;
  text: string;
}

export function spinner(text: string): Spinner {
  let index = 0;
  let interval: NodeJS.Timeout | null = null;
  let currentText = text;

  return {
    start() {
      process.stdout.write('\x1B[?25l'); // Hide cursor
      interval = setInterval(() => {
        process.stdout.write(`\r${chalk.cyan(frames[index])} ${currentText}`);
        index = (index + 1) % frames.length;
      }, 80);
    },
    stop() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      process.stdout.write('\r\x1B[K'); // Clear line
      process.stdout.write('\x1B[?25h'); // Show cursor
    },
    set text(newText: string) {
      currentText = newText;
    },
  };
}
