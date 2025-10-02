'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function CollapsedMovieCardSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'flex justify-between items-center rounded-xl border overflow-hidden',
                'bg-transparent',
                className,
            )}
        >
            <div className='flex gap-4 flex-col w-full'>
                {/* Image placeholder */}
                <div>
                    <Skeleton className='w-full h-40 md:h-60 rounded-t-lg' />
                </div>

                {/* Content placeholders */}
                <div className='flex-1 min-w-0 pb-4 px-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between items-center'>
                            <Skeleton className='h-5 w-3/5' />
                            <Skeleton className='h-4 w-16' />
                        </div>

                        {/* Genres chips */}
                        <div className='flex flex-wrap gap-2 mt-1'>
                            <Skeleton className='h-5 w-14 rounded-full' />
                            <Skeleton className='h-5 w-16 rounded-full' />
                            <Skeleton className='h-5 w-12 rounded-full' />
                        </div>
                    </div>

                    {/* Rating & votes row */}
                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                        <div className='flex items-center gap-2'>
                            {/* IMDb logo placeholder */}
                            <Skeleton className='h-4 w-10 rounded-full' />
                            <Skeleton className='h-4 w-10 rounded-full' />
                        </div>
                        <div className='flex items-center gap-2'>
                            <Skeleton className='h-4 w-10 rounded-full' />
                            <Skeleton className='h-4 w-10 rounded-full' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollapsedMovieCardSkeleton;
