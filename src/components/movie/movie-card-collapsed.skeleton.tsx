'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function CollapsedMovieCardSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'flex justify-between items-stretch rounded-xl border overflow-hidden',
                'bg-transparent',
                className,
            )}
        >
            <div className='flex w-full items-stretch'>
                {/* Left image placeholder (2/3 aspect) */}
                <div className='shrink-0'>
                    <Skeleton className='w-24 md:w-32 lg:w-40 aspect-[2/3] rounded-r-lg' />
                </div>

                {/* Right content */}
                <div className='flex-1 min-w-0 p-4 box-border flex flex-col justify-between h-full'>
                    <div className='flex flex-col gap-2'>
                        {/* Title row */}
                        <div className='flex justify-between items-center'>
                            <Skeleton className='h-4 w-2/3' />
                        </div>

                        {/* Genres chips (single line, scrollable) */}
                        <div className='flex flex-nowrap items-center overflow-x-auto gap-1 mt-1'>
                            <Skeleton className='h-5 w-14 rounded-full' />
                            <Skeleton className='h-5 w-16 rounded-full' />
                            <Skeleton className='h-5 w-12 rounded-full' />
                        </div>

                        {/* Since line */}
                        <Skeleton className='h-3 w-24' />
                    </div>

                    {/* Bottom stats row: rating + votes */}
                    <div className='mt-2'>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <Skeleton className='h-4 w-8 rounded' />
                                <Skeleton className='h-4 w-10 rounded' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <Skeleton className='h-4 w-10 rounded' />
                                <Skeleton className='h-4 w-10 rounded' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollapsedMovieCardSkeleton;
