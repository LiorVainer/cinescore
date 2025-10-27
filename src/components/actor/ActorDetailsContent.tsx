'use client';

import { ArrowLeft } from 'lucide-react';
import { useActorBasicDetail, useActorFullDetails } from '@/lib/query/actor/hooks';
import { useLocale, useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth-client';
import { useOverlayState } from '@/hooks/use-overlay-state';
import { Button } from '@/components/ui/button';
import { ActorProfile, ActorProfileSkeleton } from './ActorDetailsShared';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface ActorDetailContentProps {
    tmdbActorId: string;
}

export const ActorDetailsContent = React.memo(function ActorDetailContent({ tmdbActorId }: ActorDetailContentProps) {
    const locale = useLocale();
    const t = useTranslations('actor');
    const tmdbActorIdNum = parseInt(tmdbActorId, 10);

    // Read basic actor details from cache (populated by useTmdbActorsDetails in cast) or fetch if missing
    const {
        data: basicActor,
        isLoading: isBasicLoading,
        isError: basicError,
    } = useActorBasicDetail(tmdbActorIdNum, locale, { enabled: true });

    // Fetch full details (credits, knownFor) only inside this detail component
    const {
        data: fullActor,
        isLoading: isFullLoading,
        isError: fullError,
    } = useActorFullDetails(tmdbActorIdNum, locale, { enabled: true });

    const actor = fullActor ?? basicActor; // prefer full data when available
    const { data: session } = authClient.useSession();
    const { movieId, openMovie } = useOverlayState();

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

    console.log('ActorDetailsContent render', {
        tmdbActorId,
        actor,
        isBasicLoading,
        isFullLoading,
        basicError,
        fullError,
    });

    return (
        <div className='w-full flex flex-col items-stretch rounded-t-xl relative overflow-hidden min-h-screen md:flex-row md:items-start'>
            {/* Content */}
            <div className='relative z-10 flex-1 overflow-hidden flex flex-col'>
                {movieId && (
                    <div
                        className='
      fixed top-0 left-0 right-0 z-50
      bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
      rounded-t-lg
      border-b p-4
    '
                        style={
                            {
                                // Ensure it only overlays inside the drawer/modal context, not the whole page
                                // position: 'sticky', // fallback for Radix portals
                            }
                        }
                    >
                        <Button variant='ghost' size='sm' onClick={handleBack} className='gap-2'>
                            {isRtl ? <ArrowLeft className='h-4 w-4 rotate-180' /> : <ArrowLeft className='h-4 w-4' />}
                            {t('backToMovie')}
                        </Button>
                    </div>
                )}

                <div className='p-4 md:p-8 overflow-y-auto pt-24 md:pt-24'>
                    {/* Basic content: show immediately if available, otherwise basic skeleton */}
                    {isBasicLoading || !basicActor ? <ActorProfileSkeleton /> : <ActorProfile actor={basicActor} />}

                    {isFullLoading ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('credits')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='flex flex-col gap-3'>
                                    <Skeleton className='h-4 w-1/2' />
                                    <Skeleton className='h-4 w-3/4' />
                                    <Skeleton className='h-4 w-1/3' />
                                </div>
                            </CardContent>
                        </Card>
                    ) : fullActor?.credits && fullActor.credits.length > 0 ? (
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
                                        {fullActor.credits.map((credit) => {
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
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : null}

                    {/* Error states */}
                    {(basicError || fullError) && (
                        <div className='flex flex-col items-center justify-center py-12'>
                            <p className='text-sm text-destructive'>{t('errorLoading')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
