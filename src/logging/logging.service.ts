import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logDirectory: string;
  private readonly logFile: string;
  private readonly maxSizeKB: number;
  private readonly logLevel: LogLevel;

  constructor() {
    this.logDirectory = path.join(__dirname, '../../logs');
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory);
    }

    this.logFile = path.join(this.logDirectory, 'application.log');
    this.maxSizeKB = parseInt(process.env.LOG_FILE_SIZE_KB || '100', 10);
    const level = (process.env.LOG_LEVEL || 'info').toLowerCase();

    const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    this.logLevel = validLevels.includes(level as LogLevel)
      ? (level as LogLevel)
      : 'info';
  }

  private writeLog(message: string) {
    this.rotateLogsIfNeeded();
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ${message}`;

    fs.appendFileSync(this.logFile, fullMessage + '\n');
    process.stdout.write(fullMessage + '\n');
  }

  private rotateLogsIfNeeded() {
    if (!fs.existsSync(this.logFile)) return;

    const stats = fs.statSync(this.logFile);
    const sizeKB = stats.size / 1024;

    if (sizeKB >= this.maxSizeKB) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archive = path.join(
        this.logDirectory,
        `application-${timestamp}.log`,
      );
      fs.renameSync(this.logFile, archive);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const priorities: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return priorities[level] >= priorities[this.logLevel];
  }

  log(message: any) {
    if (this.shouldLog('info')) {
      this.writeLog(
        `INFO: ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }
  }

  error(message: any, trace?: string) {
    if (this.shouldLog('error')) {
      const fullMessage =
        `ERROR: ${typeof message === 'string' ? message : JSON.stringify(message)}` +
        (trace ? `\nTRACE: ${trace}` : '');
      this.writeLog(fullMessage);
    }
  }

  warn(message: any) {
    if (this.shouldLog('warn')) {
      this.writeLog(
        `WARN: ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }
  }

  debug(message: any) {
    if (this.shouldLog('debug')) {
      this.writeLog(
        `DEBUG: ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }
  }

  verbose(message: any) {
    this.debug(message); // NestJS interface requires this
  }
}
