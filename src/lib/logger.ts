import { env } from '@/env'
import pino from 'pino'

function getLogger() {
    return pino({ level: env.NEXT_PUBLIC_PINO_LOG_LEVEL })
}

export const logger = getLogger()