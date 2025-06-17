import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, query, body } = req;

    this.logger.log(
      `Request: ${method} ${originalUrl} | Query: ${JSON.stringify(
        query,
      )} | Body: ${JSON.stringify(body)}`,
    );

    const originalSend = res.send;
    res.send = (body?: any): Response => {
      this.logger.log(
        `Response: ${method} ${originalUrl} | Status: ${res.statusCode}`,
      );
      return originalSend.call(res, body);
    };

    next();
  }
}
