import { resend } from '../email/client';
import CatalogRefreshEmail from '@/emails/CatalogRefreshEmail';

export async function sendCatalogRefreshEmail({
    success,
    processedCount,
    durationMs,
    errorMessage,
}: {
    success: boolean;
    processedCount?: number;
    durationMs?: number;
    errorMessage?: string;
}) {
    const subject = success ? `✅ Starzi Catalog Refresh Success` : `❌ Starzi Catalog Refresh Failed`;

    await resend.emails.send({
        from: 'Starzi Cron <cron@starzi.app>',
        to: 'liorvainer@gmail.com',
        subject,
        react: (
            <CatalogRefreshEmail
                success={success}
                processedCount={processedCount}
                durationMs={durationMs}
                errorMessage={errorMessage}
            />
        ),
    });
}
