'use client';

import {ArrowLeft, Loader2} from 'lucide-react';
import {useActorDetail} from '@/lib/query/actor/hooks';
import {useLocale} from 'next-intl';
import {authClient} from '@/lib/auth-client';
import {useDrawerContent} from '@/contexts/drawer-content-context';
import {Button} from '@/components/ui/button';
import {ActorProfile, ActorBiography, ActorFilmography} from './ActorDetailShared';
import {useEffect} from 'react';
import {motion} from 'motion/react';
import type {MovieWithLanguageTranslation} from "@/models/movies.model";

interface ActorDetailContentProps {
    actorId: string;
    movieImgSrc?: string;
}

export function ActorDetailContent({actorId}: ActorDetailContentProps) {
    const locale = useLocale();
    const {data: actor, isLoading, error} = useActorDetail(actorId, locale);
    const {data: session} = authClient.useSession();
    const {goBackToMovie, content} = useDrawerContent();

    // Preload actor profile image as soon as component mounts
    useEffect(() => {
        if (actor?.profileUrl) {
            const img = new Image();
            img.src = actor.profileUrl;
        }
    }, [actor?.profileUrl]);

    return (
        <div className='w-full flex flex-col items-stretch rounded-t-xl relative overflow-hidden min-h-[60vh]'>
            {/* Background now handled by UnifiedDrawer - removed duplicate */}

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
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3, delay: 0.1}}
                        >
                            <ActorProfile actor={actor} userId={session?.user?.id}/>
                            {actor.biography && <ActorBiography biography={actor.biography}/>}
                            {actor.movies && <ActorFilmography movies={actor.movies}/>}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
