type LogLevel = 'info' | 'error' | 'warn' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  public debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();