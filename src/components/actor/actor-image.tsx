import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

export interface ActorImageProps {
    src: string | null;
    alt: string;
    loading?: 'eager' | 'lazy';
    className?: string;
}

export const ActorImage = ({ src, alt, loading, className }: ActorImageProps) => (
    <Image
        src={src ?? '/window.svg'}
        alt={alt}
        width={200}
        height={300}
        className={cn('w-full aspect-2/3 object-cover object-center', className)}
        loading={loading}
        quality={75}
        sizes='(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw'
    />
);
