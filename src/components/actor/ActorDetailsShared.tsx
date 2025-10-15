'use client';

import {Badge} from '@/components/ui/badge';
import {ActorImage} from '@/components/actor/actor-image';
import {Separator} from '@/components/ui/separator';
import {ActorFollowButton} from '@/components/follows/ActorFollowButton';
import {FollowType} from '@prisma/client';
import {CalendarDays, Film, MapPin} from 'lucide-react';
import Link from 'next/link';
import {ActorDetailsDto} from "@/models/actors.model";
import {Skeleton} from '@/components/ui/skeleton';

interface Movie {
    id: string;
    title: string;
    posterPath?: string | null;
    releaseDate: Date | null;
    rating?: number | null;
}

interface ActorProfileProps {
    // accept partial so basic payloads work without full DTO
    actor: Partial<ActorDetailsDto>;
    userId?: string;
}

export function ActorProfile({actor, userId}: ActorProfileProps) {
    return (
        <div className='flex flex-col items-center mb-6'>
            <div className='flex flex-col gap-4 items-center'>
                <ActorImage src={actor.profilePath ?? '/window.svg'} alt={actor.name ?? 'Actor'}
                            className='w-30 rounded-lg'/>

                <h2 className='text-2xl font-bold text-center mb-2'>{actor.name}</h2>
            </div>

            {userId && (
                <div className='mb-4 w-full'>
                    <ActorFollowButton userId={userId} type={FollowType.ACTOR} value={actor.name ?? ''}/>
                </div>
            )}

            <Separator className='my-4 w-full'/>

            <div className='space-y-3 w-full'>
                {actor.birthday && (
                    <div className='flex items-center gap-2 text-sm'>
                        <CalendarDays className='h-4 w-4 text-muted-foreground'/>
                        <span>
                            {new Date(actor.birthday as any).toLocaleDateString('en-US', {
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

                {/* biography handled by ActorDetailsContent/ActorBasicContent */}
            </div>
        </div>
    );
}

interface ActorBiographyProps {
    biography: string;
}

export function ActorBiography({biography}: ActorBiographyProps) {
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

export function ActorFilmography({movies}: ActorFilmographyProps) {
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
                                        <Film className='h-6 w-6 text-muted-foreground'/>
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
                    <Film className='h-10 w-10 mx-auto mb-3 opacity-50'/>
                    <p className='text-sm'>No movies found for this actor.</p>
                </div>
            )}
        </div>
    );
}

// Basic content component that uses only lightweight actor data
export function ActorBasicContent({basicActor, userId}:{
    basicActor: { id:number; tmdbId:number; name:string; profilePath:string|null; biography:string|null } | null;
    userId?: string | undefined;
}){
    if(!basicActor) return null;

    return (
        <div className='space-y-6'>
            <ActorProfile actor={{
                name: basicActor.name,
                profilePath: basicActor.profilePath ?? undefined,
                biography: basicActor.biography ?? undefined,
            }} userId={userId}/>

            {basicActor.biography && (
                <div className='mb-4'>
                    <h3 className='text-lg font-semibold mb-2'>Biography</h3>
                    <p className='text-sm text-muted-foreground'>{basicActor.biography}</p>
                </div>
            )}
        </div>
    );
}

// Skeleton for ActorProfile layout to show while basic data loads
export function ActorProfileSkeleton() {
    return (
        <div className='flex flex-col items-center mb-6 gap-2'>
            <div className='flex flex-col gap-4 items-center w-full'>
                <Skeleton className='w-30 h-40 rounded-lg' />
                <Skeleton className='h-6 w-48 rounded-md' />
            </div>

            <div className='mb-4 w-full flex justify-center'>
                <Skeleton className='h-8 w-24 rounded-md' />
            </div>

            <Separator className='my-4 w-full'/>

            <div className='space-y-3 w-full'>
                <div className='flex items-center gap-2 text-sm'>
                    <Skeleton className='h-4 w-6 rounded' />
                    <Skeleton className='h-4 w-32 rounded' />
                </div>

                <div className='flex items-center gap-2 text-sm'>
                    <Skeleton className='h-4 w-6 rounded' />
                    <Skeleton className='h-4 w-40 rounded' />
                </div>
            </div>
        </div>
    );
}
