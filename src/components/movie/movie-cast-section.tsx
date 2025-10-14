'use client';

import React, {useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {useLocale, useTranslations} from 'next-intl';
import {useIsMobile} from '@/hooks/use-mobile';
import {motion, Variants} from 'motion/react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import {useOverlayState} from '@/hooks/use-overlay-state';
import {useQueryClient} from '@tanstack/react-query';
import {actorFullDetailsOptions} from '@/lib/query/actor/query-options';
import Image from 'next/image';
import {ActorImage} from "@/components/actor/actor-image";

type MovieCastSectionProps = {
    cast: MovieWithLanguageTranslation['cast'];
};

export const MovieCastSection = ({cast}: MovieCastSectionProps) => {
    const t = useTranslations('movie');
    const isMobile = useIsMobile();
    const locale = useLocale();
    const [showAllCast, setShowAllCast] = React.useState(false);
    const {openActor} = useOverlayState();
    const queryClient = useQueryClient();

    // Handle actor click for both mobile and desktop
    const handleActorClick = useCallback(
        (tmdbActorId: number | null, e: React.MouseEvent) => {
            if (tmdbActorId) {
                e.preventDefault();
                openActor(tmdbActorId.toString());
            }
        },
        [openActor],
    );

    // Prefetch actor data on hover/touch to reduce loading time
    const handleActorHover = useCallback(
        (tmdbActorId: number) => {
            void queryClient.prefetchQuery(actorFullDetailsOptions(tmdbActorId, locale));
        },
        [queryClient, locale],
    );

    const toggleShowAll = useCallback(() => {
        setShowAllCast((prev) => !prev);
    }, []);

    // Early return after all hooks
    if (!cast || cast.length === 0) {
        return null;
    }

    // Calculate items per row based on grid columns
    const itemsPerRow = isMobile ? 3 : 6;
    const displayedCast = showAllCast ? cast : cast.slice(0, itemsPerRow);
    const hasMoreCast = cast.length > itemsPerRow;

    // Container animation variants with faster stagger
    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.04,
            },
        },
    };

    // Individual card animation variants with faster duration
    const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 15,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <div className='flex flex-col gap-2'>
            <h3 className='font-semibold text-sm'>{t('cast')}</h3>
            <div className='flex flex-col gap-3'>
                <motion.div
                    className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
                    variants={containerVariants}
                    initial='hidden'
                    animate='visible'
                >
                    {displayedCast.map((castMember, index) => (
                        <motion.div key={castMember.id} variants={cardVariants} custom={index}>
                            <div
                                onClick={(e) => handleActorClick(castMember.actor.tmdbId, e)}
                                onTouchStart={() => castMember.actor.tmdbId && handleActorHover(castMember.actor.tmdbId)}
                                onMouseEnter={() => castMember.actor.tmdbId && handleActorHover(castMember.actor.tmdbId)}
                                className='relative block text-xs overflow-hidden group rounded-lg cursor-pointer transition-transform hover:scale-105'
                            >
                                <ActorImage
                                    src={castMember.actor.profileUrl ?? '/window.svg'}
                                    alt={castMember.actor.name}
                                    loading={index < itemsPerRow ? 'eager' : 'lazy'}
                                />
                                <div
                                    className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 pt-8'>
                                    <span className='font-medium text-white text-sm line-clamp-2'>
                                        {castMember.actor.name}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                {hasMoreCast && (
                    <Button variant='outline' size='sm' onClick={toggleShowAll} className='w-full rounded-lg'>
                        {showAllCast ? t('showLess') : t('showAll')}
                    </Button>
                )}
            </div>
        </div>
    );
};
