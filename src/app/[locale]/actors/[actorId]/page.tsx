import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {getQueryClient} from '@/lib/query';
import {notFound} from 'next/navigation';
import {auth} from '@/lib/auth';
import {userFollowsOptions} from '@/lib/query/follow';
import {getActorById} from '@/app/actions/actors';
import {getTranslations} from 'next-intl/server';
import type {Locale} from 'next-intl';
import {ActorBiography, ActorFilmography, ActorProfile} from '@/components/actor/ActorDetailsShared';

interface ActorPageProps {
    params: Promise<{
        actorId: string;
        locale: string;
    }>;
}

export default async function ActorPage(props: ActorPageProps) {
    const params = await props.params;
    const { actorId, locale } = params;
    const session = await auth.api.getSession({
        headers: await import('next/headers').then((m) => m.headers()),
    });
    const queryClient = getQueryClient();

    // Fetch actor data
    const actor = await getActorById(actorId, locale);

    if (!actor) {
        notFound();
    }

    // Prefetch user follows if authenticated
    if (session?.user) {
        await queryClient.prefetchQuery(userFollowsOptions(session.user.id));
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className='container mx-auto px-4 py-8'>
                <div className='max-w-7xl mx-auto'>
                    {/* Desktop: Two-column layout, Mobile: Single column */}
                    <div className='grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8'>
                        {/* Left Column: Actor Profile - Sticky on desktop */}
                        <aside className='lg:sticky lg:top-8 lg:self-start'>
                            <ActorProfile actor={actor} userId={session?.user?.id} />
                        </aside>

                        {/* Right Column: Biography & Filmography */}
                        <main className='space-y-8'>
                            {actor.biography && <ActorBiography biography={actor.biography} />}
                            {actor.movies && <ActorFilmography movies={actor.movies} />}
                        </main>
                    </div>
                </div>
            </div>
        </HydrationBoundary>
    );
}

// Generate metadata for SEO
export async function generateMetadata(props: ActorPageProps) {
    const params = await props.params;
    const { actorId, locale } = params;

    const actor = await getActorById(actorId, locale);

    if (!actor) {
        const t = await getTranslations({
            locale: locale as Locale,
            namespace: 'actor',
        });

        return {
            title: t('notFound'),
        };
    }

    const t = await getTranslations({
        locale: locale as Locale,
        namespace: 'actor',
    });

    const tM = await getTranslations({
        locale: locale as Locale,
        namespace: 'metadata',
    });

    return {
        title: `${actor.name} | ${tM('title')}`,
        description: actor.biography?.substring(0, 160) || t('pageDescription', { name: actor.name }),
    };
}
