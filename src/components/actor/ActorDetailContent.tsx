'use client';

import {ArrowLeft, Loader2} from 'lucide-react';
import {useActorDetail} from '@/lib/query/actor/hooks';
import {useLocale} from 'next-intl';
import {authClient} from '@/lib/auth-client';
import {useDrawerContent} from '@/contexts/drawer-content-context';
import {Button} from '@/components/ui/button';
import {ActorProfile, ActorBiography, ActorFilmography} from './ActorDetailShared';

interface ActorDetailContentProps {
    actorId: string;
}

export function ActorDetailContent({actorId}: ActorDetailContentProps) {
    const locale = useLocale();
    const {data: actor, isLoading, error} = useActorDetail(actorId, locale);
    const {data: session} = authClient.useSession();
    const {goBackToMovie, content} = useDrawerContent();

    return (
        <div className='w-full flex flex-col items-stretch rounded-t-xl relative overflow-hidden'>
            {/* Blurred background with actor photo */}
            {actor?.profileUrl && (
                <div
                    className='absolute inset-0 z-0'
                    style={{
                        backgroundImage: `url(${actor.profileUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(15px)',
                        transform: 'scale(1.1)',
                    }}
                >
                    <div className='absolute inset-0 bg-background/80 dark:bg-background/80'/>
                </div>
            )}

            {/* Content */}
            <div className='relative z-10'>
                {/* Back Button - only show if navigated from movie */}
                {content?.movieId && (
                    <div
                        className='sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4'>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={goBackToMovie}
                            className='gap-2'
                        >
                            <ArrowLeft className='h-4 w-4'/>
                            Back to Movie
                        </Button>
                    </div>
                )}

                <div className='p-4'>
                    {/* Loading State */}
                    {isLoading && (
                        <div className='flex flex-col items-center justify-center py-12'>
                            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground mb-2'/>
                            <p className='text-sm text-muted-foreground'>Loading actor details...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className='flex flex-col items-center justify-center py-12'>
                            <p className='text-sm text-destructive'>Failed to load actor details</p>
                        </div>
                    )}

                    {/* Actor Content - composed from shared components */}
                    {actor && (
                        <>
                            <ActorProfile actor={actor} userId={session?.user?.id}/>
                            {actor.biography && <ActorBiography biography={actor.biography}/>}
                            {actor.movies && <ActorFilmography movies={actor.movies}/>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
