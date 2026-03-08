import pino from 'pino';

/**
 * Pino structured logger — single instance for the entire app.
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info({ orderId, userId }, "Order created");
 *   logger.warn({ customerId }, "Low credit balance");
 *   logger.error({ error, requestId }, "Payment webhook failed");
 *
 * In production, output is newline-delimited JSON — pipe to your log aggregator.
 * In development, output is pretty-printed via pino-pretty (install separately if needed).
 */
const logger = pino({
  name: 'rotana-api',
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  // In development, keep timestamps readable; in prod, use epoch ms for log aggregators
  timestamp: pino.stdTimeFunctions.isoTime,
  // Never log these fields — PII & secrets
  redact: {
    paths: [
      'password',
      'passwordHash',
      'token',
      'accessToken',
      'refreshToken',
      '*.password',
      '*.passwordHash',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
  base: {
    service: 'rotana-api',
    env: process.env.NODE_ENV,
  },
});

export { logger };
