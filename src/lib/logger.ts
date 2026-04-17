import { env } from '@/env'
import pino from 'pino'

export const logger = pino({ level: env.NEXT_PUBLIC_PINO_LOG_LEVEL ?? 'info' })