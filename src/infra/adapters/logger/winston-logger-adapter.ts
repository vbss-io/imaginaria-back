import winston from 'winston'

import type { Logger } from '@/domain/providers/logger/logger'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const meta = info.meta ? JSON.stringify(info.meta, null, 2) : ''
    return `${info.timestamp} ${info.level}: ${info.message} ${meta}`
  })
)

const minLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'http'

const transports = [
  new winston.transports.Console({
    level: minLevel
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error'
  }),
  new winston.transports.File({
    filename: 'logs/all.log',
    level: minLevel
  })
]

export class WinstonLoggerAdapter implements Logger {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: minLevel,
      levels,
      format,
      transports
    })
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, { meta })
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { meta })
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { meta })
  }

  http(message: string, meta?: Record<string, unknown>): void {
    this.logger.http(message, { meta })
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { meta })
  }
}
