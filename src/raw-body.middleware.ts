import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request & { rawBody?: Buffer }, _res: Response, next: NextFunction) {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      req.rawBody = Buffer.concat(chunks);
      try {
        if (req.rawBody) req.body = JSON.parse(req.rawBody.toString());
      } catch (e) {}
      next();
    });
  }
}
