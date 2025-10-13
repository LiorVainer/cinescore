'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {useTranslations} from 'next-intl';
import {useIsMobile} from '@/hooks/use-mobile';
import {motion, Variants} from 'motion/react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import {Link} from '@/i18n/navigation';
import {useDrawerContent} from '@/contexts/drawer-content-context';
import {useQueryClient} from '@tanstack/react-query';
import {actorDetailOptions} from '@/lib/query/actor/query-options';
import {useLocale} from 'next-intl';

type MovieCastSectionProps = {
    cast: MovieWithLanguageTranslation['cast'];
};

export const MovieCastSection = ({cast}: MovieCastSectionProps) => {
    const t = useTranslations('movie');
    const isMobile = useIsMobile();
    const locale = useLocale();
    const [showAllCast, setShowAllCast] = React.useState(false);
    const {openActor} = useDrawerContent();
    const queryClient = useQueryClient();

    if (!cast || cast.length === 0) {
        return null;
    }

    // Calculate items per row based on grid columns
    const itemsPerRow = isMobile ? 3 : 6;
    const displayedCast = showAllCast ? cast : cast.slice(0, itemsPerRow);
    const hasMoreCast = cast.length > itemsPerRow;

    // Container animation variants with stagger
    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    // Individual card animation variants
    const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    const handleActorClick = (actorId: string, e: React.MouseEvent) => {
        if (isMobile) {
            e.preventDefault();
            openActor(actorId);
        }
    };

    // Prefetch actor data on hover/touch to reduce loading time
    const handleActorHover = (actorId: string) => {
        if (isMobile) {
            queryClient.prefetchQuery(actorDetailOptions(actorId, locale));
        }
    };

    return (
        <div className='flex flex-col gap-2'>
            <h3 className='font-semibold text-sm'>{t('cast')}</h3>
            <div className='flex flex-col gap-3'>
                <motion.div
                    className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'
                    variants={containerVariants}
                    initial='hidden'
                    animate='visible'
                >
                    {displayedCast.map((castMember, index) => (
                        <motion.div
                            key={castMember.id}
                            variants={cardVariants}
                            custom={index}
                        >
                            <Link
                                href={`/actors/${castMember.actor.id}`}
                                onClick={(e) => handleActorClick(castMember.actor.id, e)}
                                onTouchStart={() => handleActorHover(castMember.actor.id)}
                                onMouseEnter={() => handleActorHover(castMember.actor.id)}
                                className='relative block text-xs overflow-hidden group rounded-lg cursor-pointer transition-transform hover:scale-105'
                            >
                                <img
                                    src={castMember.actor.profileUrl ?? ''}
                                    alt={castMember.actor.name}
                                    className='w-full aspect-2/3 object-cover object-center'
                                />
                                <div
                                    className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 pt-8'>
                                    <span className='font-medium text-white text-sm line-clamp-2'>
                                        {castMember.actor.name}
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
                {hasMoreCast && (
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setShowAllCast(!showAllCast)}
                        className='w-full rounded-lg'
                    >
                        {showAllCast ? t('showLess') : t('showAll')}
                    </Button>
                )}
            </div>
        </div>
    );
};
