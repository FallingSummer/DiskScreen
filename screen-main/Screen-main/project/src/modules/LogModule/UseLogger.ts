import { logger } from './Logger';

export function UseLogger(module = 'App') {
  return {
    debug: (message: string, context?: Record<string, unknown>) => logger.debug(message, context, module),
    info: (message: string, context?: Record<string, unknown>) => logger.info(message, context, module),
    warn: (message: string, context?: Record<string, unknown>) => logger.warn(message, context, module),
    error: (message: string, context?: Record<string, unknown>) => logger.error(message, context, module),
    fatal: (message: string, context?: Record<string, unknown>) => logger.fatal(message, context, module),
  };
}
