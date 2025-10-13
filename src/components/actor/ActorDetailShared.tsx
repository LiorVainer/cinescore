'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ActorFollowButton } from '@/components/follows/ActorFollowButton';
import { FollowType } from '@prisma/client';
import { CalendarDays, MapPin, Film } from 'lucide-react';
import Link from 'next/link';

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

interface ActorProfileProps {
    actor: Actor;
    userId?: string;
}

export function ActorProfile({ actor, userId }: ActorProfileProps) {
    return (
        <div className='flex flex-col items-center mb-6'>
            <Avatar className='h-32 w-32 mb-4'>
                <AvatarImage src={actor.profileUrl || undefined} alt={actor.name} />
                <AvatarFallback className='text-3xl'>
                    {actor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <h2 className='text-2xl font-bold text-center mb-2'>{actor.name}</h2>

            {userId && (
                <div className='mb-4 w-full'>
                    <ActorFollowButton userId={userId} type={FollowType.ACTOR} value={actor.name} />
                </div>
            )}

            <Separator className='my-4 w-full' />

            <div className='space-y-3 w-full'>
                {actor.birthday && (
                    <div className='flex items-center gap-2 text-sm'>
                        <CalendarDays className='h-4 w-4 text-muted-foreground' />
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
                        <MapPin className='h-4 w-4 text-muted-foreground' />
                        <span>{actor.placeOfBirth}</span>
                    </div>
                )}

                {actor.movies && (
                    <div className='flex items-center gap-2 text-sm'>
                        <Film className='h-4 w-4 text-muted-foreground' />
                        <span>{actor.movies.length} Movies</span>
                    </div>
                )}
            </div>
        </div>
    );
}

interface ActorBiographyProps {
    biography: string;
}

export function ActorBiography({ biography }: ActorBiographyProps) {
    return (
        <div className='mb-6'>
            <h3 className='text-lg font-semibold mb-2'>Biography</h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>{biography}</p>
        </div>
    );
}

interface ActorFilmographyProps {
    movies: Movie[];
}

export function ActorFilmography({ movies }: ActorFilmographyProps) {
    return (
        <div>
            <h3 className='text-lg font-semibold mb-3'>
                Filmography
                <span className='text-sm text-muted-foreground ml-2'>({movies.length} movies)</span>
            </h3>

            {movies.length > 0 ? (
                <div className='space-y-3'>
                    {movies.map((movie) => (
                        <Link
                            key={movie.id}
                            href={`/movies/${movie.id}`}
                            className='flex gap-3 p-3 rounded-lg border hover:bg-accent transition-colors'
                        >
                            <div className='flex-shrink-0'>
                                {movie.posterPath ? (
                                    <img
                                        src={movie.posterPath}
                                        alt={movie.title}
                                        className='h-20 w-14 object-cover rounded'
                                    />
                                ) : (
                                    <div className='h-20 w-14 bg-muted rounded flex items-center justify-center'>
                                        <Film className='h-6 w-6 text-muted-foreground' />
                                    </div>
                                )}
                            </div>

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
            ) : (
                <div className='text-center py-8 text-muted-foreground'>
                    <Film className='h-10 w-10 mx-auto mb-3 opacity-50' />
                    <p className='text-sm'>No movies found for this actor.</p>
                </div>
            )}
        </div>
    );
}
