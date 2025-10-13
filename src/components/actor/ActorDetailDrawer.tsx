'use client';

import {Drawer, DrawerContent} from '@/components/ui/drawer';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Separator} from '@/components/ui/separator';
import {ActorFollowButton} from '@/components/follows/ActorFollowButton';
import {FollowType} from '@prisma/client';
import {CalendarDays, MapPin, Film, Loader2} from 'lucide-react';
import Link from 'next/link';
import {useActorDetail} from '@/lib/query/actor/hooks';
import {useLocale} from 'next-intl';
import {authClient} from "@/lib/auth-client";

interface Movie {
    id: string;
    title: string;
    posterPath?: string | null;
    releaseDate: Date | null;
    rating?: number | null;
}

interface Actor {
    id: string;
    name: string;
    biography?: string | null;
    birthday?: Date | null;
    placeOfBirth?: string | null;
    profileUrl?: string | null;
    movies?: Movie[];
}

interface ActorDetailDrawerProps {
    actorId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActorDetailDrawer({actorId, open, onOpenChange}: ActorDetailDrawerProps) {
    const locale = useLocale();
    const {data: actor, isLoading, error} = useActorDetail(actorId || '', locale);
    const {data: session, isPending} = authClient.useSession();

    if (!actorId) return null;

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className='max-h-[90vh] overflow-hidden'>
                <div className='overflow-y-auto max-h-full p-4'>
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

                    {/* Actor Content */}
                    {actor && (
                        <>
                            {/* Actor Profile Section */}
                            <div className='flex flex-col items-center mb-6'>
                                {/* Avatar */}
                                <Avatar className='h-32 w-32 mb-4'>
                                    <AvatarImage
                                        src={actor.profileUrl || undefined}
                                        alt={actor.name}
                                    />
                                    <AvatarFallback className='text-3xl'>
                                        {actor.name
                                            .split(' ')
                                            .map(n => n[0])
                                            .join('')
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Name */}
                                <h2 className='text-2xl font-bold text-center mb-2'>
                                    {actor.name}
                                </h2>

                                {/* Follow Button */}
                                {session?.user.id && (
                                    <div className='mb-4 w-full'>
                                        <ActorFollowButton
                                            userId={session.user.id}
                                            type={FollowType.ACTOR}
                                            value={actor.name}
                                        />
                                    </div>
                                )}

                                <Separator className='my-4 w-full'/>

                                {/* Actor Details */}
                                <div className='space-y-3 w-full'>
                                    {actor.birthday && (
                                        <div className='flex items-center gap-2 text-sm'>
                                            <CalendarDays className='h-4 w-4 text-muted-foreground'/>
                                            <span>
                                                {new Date(actor.birthday).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    )}

                                    {actor.placeOfBirth && (
                                        <div className='flex items-center gap-2 text-sm'>
                                            <MapPin className='h-4 w-4 text-muted-foreground'/>
                                            <span>{actor.placeOfBirth}</span>
                                        </div>
                                    )}

                                    {actor.movies && (
                                        <div className='flex items-center gap-2 text-sm'>
                                            <Film className='h-4 w-4 text-muted-foreground'/>
                                            <span>{actor.movies.length} Movies</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Biography */}
                            {actor.biography && (
                                <div className='mb-6'>
                                    <h3 className='text-lg font-semibold mb-2'>Biography</h3>
                                    <p className='text-muted-foreground text-sm leading-relaxed'>
                                        {actor.biography}
                                    </p>
                                </div>
                            )}

                            {/* Filmography */}
                            <div>
                                <h3 className='text-lg font-semibold mb-3'>
                                    Filmography
                                    <span className='text-sm text-muted-foreground ml-2'>
                                        ({actor.movies?.length || 0} movies)
                                    </span>
                                </h3>

                                <div className='space-y-3'>
                                    {actor.movies?.map((movie) => (
                                        <Link
                                            key={movie.id}
                                            href={`/movies/${movie.id}`}
                                            className='flex gap-3 p-3 rounded-lg border hover:bg-accent transition-colors'
                                            onClick={() => onOpenChange(false)}
                                        >
                                            {/* Movie Poster */}
                                            <div className='flex-shrink-0'>
                                                {movie.posterPath ? (
                                                    <img
                                                        src={movie.posterPath}
                                                        alt={movie.title}
                                                        className='h-20 w-14 object-cover rounded'
                                                    />
                                                ) : (
                                                    <div
                                                        className='h-20 w-14 bg-muted rounded flex items-center justify-center'>
                                                        <Film className='h-6 w-6 text-muted-foreground'/>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Movie Info */}
                                            <div className='flex-1 min-w-0'>
                                                <h4 className='font-semibold text-sm truncate'>{movie.title}</h4>
                                                {movie.releaseDate && (
                                                    <p className='text-xs text-muted-foreground'>
                                                        {new Date(movie.releaseDate).getFullYear()}
                                                    </p>
                                                )}
                                                {movie.rating && (
                                                    <Badge variant='secondary' className='mt-1 text-xs'>
                                                        ⭐ {movie.rating.toFixed(1)}
                                                    </Badge>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Empty State */}
                                {(!actor.movies || actor.movies.length === 0) && (
                                    <div className='text-center py-8 text-muted-foreground'>
                                        <Film className='h-10 w-10 mx-auto mb-3 opacity-50'/>
                                        <p className='text-sm'>No movies found for this actor.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
