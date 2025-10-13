'use client';

import {ArrowLeft, Loader2} from 'lucide-react';
import {useActorFullDetails} from '@/lib/query/actor/hooks';
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
    const {data: actor, isLoading, error} = useActorFullDetails(tmdbActorIdNum, locale);
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
                        className='sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4'>
                        <Button variant='ghost' size='sm' onClick={handleBack} className='gap-2'>
                            {isRtl ? (
                                <ArrowLeft className='h-4 w-4 rotate-180'/>
                            ) : (
                                <ArrowLeft className='h-4 w-4'/>
                            )}
                            {t('backToMovie')}
                        </Button>
                    </div>
                )}

                <div className='p-4 md:p-8 overflow-y-auto'>
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
                                                    <TableHead>{t('releaseDate')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {actor.credits.map((credit) => (
                                                    <TableRow key={credit.id}>
                                                        <TableCell>{credit.title}</TableCell>
                                                        <TableCell>{credit.character || t('unknown')}</TableCell>
                                                        <TableCell>{credit.releaseDate || t('unknown')}</TableCell>
                                                    </TableRow>
                                                ))}
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
