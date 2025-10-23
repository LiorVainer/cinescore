import * as Sentry from '@sentry/nextjs';

type LogLevel = 'debug' | 'info' | 'warning' | 'error';

const isProduction = process.env.NODE_ENV === 'production';

const consoleLogger: Record<LogLevel, (message?: unknown, ...optionalParams: unknown[]) => void> = {
    debug: console.debug.bind(console),
    info: console.info.bind(console),
    warning: console.warn.bind(console),
    error: console.error.bind(console),
};

const levelLabels: Record<LogLevel, string> = {
    debug: '[DEBUG]',
    info: '[INFO]',
    warning: '[WARNING]',
    error: '[ERROR]',
};

const normaliseExtra = (extra?: Record<string, unknown> | Error) => {
    if (!extra) {
        return undefined;
    }

    if (extra instanceof Error) {
        return {
            name: extra.name,
            message: extra.message,
            stack: extra.stack,
        };
    }

    return extra;
};

function baseLog(level: LogLevel, message: string, scope?: string, extra?: Record<string, unknown> | Error) {
    const prefixedMessage = scope ? `[${scope}] ${message}` : message;
    const normalizedExtra = normaliseExtra(extra);

    Sentry.addBreadcrumb({
        category: scope ?? 'app',
        message,
        level,
        data: normalizedExtra,
    });

    const sentryLogMethod = level === 'warning' ? 'warn' : level;
    Sentry.logger[sentryLogMethod](prefixedMessage, normalizedExtra);

    if (!isProduction) {
        const logger = consoleLogger[level];
        logger(`${levelLabels[level]} ${prefixedMessage}`, extra ?? '');
        return;
    }

    if (level === 'error' && extra instanceof Error) {
        Sentry.captureException(extra, {
            level,
            tags: scope ? { scope } : undefined,
        });
        return;
    }

    Sentry.captureMessage(prefixedMessage, {
        level,
        tags: scope ? { scope } : undefined,
        extra: normalizedExtra,
    });
}

export const logger = {
    debug: (message: string, extra?: Record<string, unknown>) => baseLog('debug', message, undefined, extra),
    info: (message: string, extra?: Record<string, unknown>) => baseLog('info', message, undefined, extra),
    warn: (message: string, extra?: Record<string, unknown>) => baseLog('warning', message, undefined, extra),
    error: (message: string, extra?: Record<string, unknown> | Error) => baseLog('error', message, undefined, extra),
    scope(scope: string) {
        return {
            debug: (message: string, extra?: Record<string, unknown>) => baseLog('debug', message, scope, extra),
            info: (message: string, extra?: Record<string, unknown>) => baseLog('info', message, scope, extra),
            warn: (message: string, extra?: Record<string, unknown>) => baseLog('warning', message, scope, extra),
            error: (message: string, extra?: Record<string, unknown> | Error) =>
                baseLog('error', message, scope, extra),
        };
    },
};
