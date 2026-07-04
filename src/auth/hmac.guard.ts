import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { Request } from 'express';

const MAX_AGE_MS = 2 * 60 * 1000; // 2 minutes

@Injectable()
export class HmacGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { rawBody?: Buffer }>();

    const timestamp = req.headers['x-timestamp'] as string | undefined;
    const signature = req.headers['x-signature'] as string | undefined;

    if (!timestamp || !signature) {
      throw new UnauthorizedException('Missing x-timestamp or x-signature header');
    }

    // 1. Check timestamp window (± 2 minutes)
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts) || Math.abs(Date.now() - ts) > MAX_AGE_MS) {
      throw new UnauthorizedException('Timestamp expired or invalid');
    }

    // 2. Verify HMAC-SHA256 signature
    const secret = process.env.HMAC_SECRET;
    if (!secret) {
      throw new UnauthorizedException('Server misconfiguration: HMAC_SECRET not set');
    }

    const rawBody = req.rawBody?.toString() ?? '';
    const expected = createHmac('sha256', secret)
      .update(`${timestamp}:${rawBody}`)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    try {
      const expectedBuf = Buffer.from(expected, 'hex');
      const actualBuf = Buffer.from(signature, 'hex');
      if (
        expectedBuf.length !== actualBuf.length ||
        !timingSafeEqual(expectedBuf, actualBuf)
      ) {
        throw new UnauthorizedException('Invalid signature');
      }
    } catch {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}
