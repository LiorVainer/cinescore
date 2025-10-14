'use client';

import {ArrowLeft, Loader2} from 'lucide-react';
import {useQueries} from '@tanstack/react-query';
import {useActorFullDetails} from '@/lib/query/actor/hooks';
import {actorFullDetailsOptions} from '@/lib/query/actor/query-options';
import {useLocale, useTranslations} from 'next-intl';
import {authClient} from '@/lib/auth-client';
import {useOverlayState} from '@/hooks/use-overlay-state';
import {Button} from '@/components/ui/button';
import {ActorBiography, ActorProfile} from './ActorDetailsShared';
import React, {useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';

interface ActorDetailContentProps {
    tmdbActorId: string;
}

export const ActorDetailsContent = React.memo(function ActorDetailContent({tmdbActorId}: ActorDetailContentProps) {
    const locale = useLocale();
    const t = useTranslations('actor');
    const tmdbActorIdNum = parseInt(tmdbActorId, 10);

    // Preload all actor details using useQueries
    const actorQueries = useQueries({
        queries: [
            actorFullDetailsOptions(tmdbActorIdNum, locale),
        ].map((options) => ({
            queryKey: options.queryKey,
            queryFn: options.queryFn,
            staleTime: options.staleTime,
        })),
    });

    const actor = actorQueries[0]?.data;
    const isLoading = actorQueries.some((query) => query.isLoading);
    const error = actorQueries.some((query) => query.isError);
    const {data: session} = authClient.useSession();
    const {movieId, openMovie} = useOverlayState();

    // Preload actor profile image as soon as component mounts
    useEffect(() => {
        if (actor?.profilePath) {
            const img = new Image();
            img.src = actor.profilePath;
        }
    }, [actor?.profilePath]);

    const isRtl = locale === 'he';

    // Memoize the back handler - navigates back to movie if movieId exists
    const handleBack = React.useCallback(() => {
        if (movieId) {
            openMovie(movieId);
        }
    }, [movieId, openMovie]);

    console.log('ActorDetailsContent render', {tmdbActorId, actor, isLoading, error});

    return (
        <div
            className='w-full flex flex-col items-stretch rounded-t-xl relative overflow-hidden min-h-screen md:flex-row md:items-start'>
            {/* Content */}
            <div className='relative z-10 flex-1 overflow-hidden flex flex-col'>
                {movieId && (
                    <div
                        className="
      fixed top-0 left-0 right-0 z-50
      bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
      rounded-t-lg
      border-b p-4
    "
                        style={{
                            // Ensure it only overlays inside the drawer/modal context, not the whole page
                            // position: 'sticky', // fallback for Radix portals
                        }}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="gap-2"
                        >
                            {isRtl ? (
                                <ArrowLeft className="h-4 w-4 rotate-180"/>
                            ) : (
                                <ArrowLeft className="h-4 w-4"/>
                            )}
                            {t('backToMovie')}
                        </Button>
                    </div>
                )}

                <div className='p-4 md:p-8 overflow-y-auto pt-20'>
                    {/* Loading State */}
                    {isLoading && (
                        <div className='flex flex-col items-center justify-center py-12'>
                            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground mb-2'/>
                            <p className='text-sm text-muted-foreground'>{t('loading')}</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className='flex flex-col items-center justify-center py-12'>
                            <p className='text-sm text-destructive'>{t('errorLoading')}</p>
                        </div>
                    )}

                    {/* Actor Content - composed from shared components */}
                    {actor && (
                        <div className='space-y-6'>
                            <ActorProfile actor={actor} userId={session?.user?.id}/>

                            {actor.biography && (
                                <Card className='mb-4'>
                                    <CardHeader>
                                        <CardTitle>{t('biography')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='text-sm'>{actor.biography}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {actor.credits && actor.credits.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('credits')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader dir={'rtl'}>
                                                <TableRow>
                                                    <TableHead>{t('title')}</TableHead>
                                                    <TableHead>{t('character')}</TableHead>
                                                    <TableHead>{t('releaseYear')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {actor.credits.map((credit) => {
                                                    const year =
                                                        credit.releaseDate && !isNaN(Date.parse(credit.releaseDate))
                                                            ? new Date(credit.releaseDate).getFullYear()
                                                            : t('unknown');

                                                    return (
                                                        <TableRow key={credit.id}>
                                                            <TableCell>{credit.title}</TableCell>
                                                            <TableCell>{credit.character || t('unknown')}</TableCell>
                                                            <TableCell>{year}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
