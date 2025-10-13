'use client';

import {ArrowLeft, Loader2} from 'lucide-react';
import {useTmdbActorDetails} from '@/lib/query/actor/hooks';
import {useLocale} from 'next-intl';
import {authClient} from '@/lib/auth-client';
import {useOverlayState} from '@/hooks/use-overlay-state';
import {Button} from '@/components/ui/button';
import {ActorBiography, ActorProfile} from './ActorDetailsShared';
import React, {useEffect} from 'react';

interface ActorDetailContentProps {
    tmdbActorId: string;
}

export const ActorDetailsContent = React.memo(function ActorDetailContent({tmdbActorId}: ActorDetailContentProps) {
    const locale = useLocale();
    const tmdbActorIdNum = parseInt(tmdbActorId, 10);
    const {data: actor, isLoading, error} = useTmdbActorDetails(tmdbActorIdNum, locale);
    const {data: session} = authClient.useSession();
    const {movieId, openMovie} = useOverlayState();

    // Preload actor profile image as soon as component mounts
    useEffect(() => {
        if (actor?.profilePath) {
            const img = new Image();
            img.src = actor.profilePath;
        }
    }, [actor?.profilePath]);

    // Memoize the back handler - navigates back to movie if movieId exists
    const handleBack = React.useCallback(() => {
        if (movieId) {
            openMovie(movieId);
        }
    }, [movieId, openMovie]);

    return (
        <div className='w-full flex flex-col items-stretch rounded-t-xl relative overflow-hidden min-h-[60vh]'>
            {/* Content */}
            <div className='relative z-10'>
                {/* Back Button - only show if navigated from movie */}
                {movieId && (
                    <div
                        className='sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4'>
                        <Button variant='ghost' size='sm' onClick={handleBack} className='gap-2'>
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
                        <div>
                            <ActorProfile actor={actor} userId={session?.user?.id}/>
                            {actor.biography && <ActorBiography biography={actor.biography}/>}
                            {/*{actor.movies && <ActorFilmography movies={actor.movies} />}*/}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
