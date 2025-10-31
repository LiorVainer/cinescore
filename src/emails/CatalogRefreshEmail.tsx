import { Html, Body, Heading, Text, Container } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

export default function CatalogRefreshEmail({
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
    return (
        <Html>
            <Tailwind>
                <Body className='bg-white font-sans'>
                    <Container className='p-6 border rounded-lg shadow-sm'>
                        <Heading className={success ? 'text-green-600' : 'text-red-600'}>
                            {success ? '✅ Catalog Refresh Completed' : '❌ Catalog Refresh Failed'}
                        </Heading>

                        {success ? (
                            <>
                                <Text className='text-sm'>
                                    ✅ <strong>{processedCount}</strong> movies processed
                                </Text>
                                <Text className='text-sm'>
                                    ⏱️ Duration: <strong>{Math.round(durationMs! / 1000)}s</strong>
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text className='text-sm text-red-600'>Error: {errorMessage}</Text>
                            </>
                        )}

                        <Text className='mt-4 text-xs text-gray-500'>– Starzi Cron Engine 🚀</Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
