'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
    posters: string[];
}

// Variants
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.15,
        },
    },
};

const rowVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.07, // controls delay *between posters*
        },
    },
};

const posterVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.97 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
} as const;

export function HeroBackground3D({ posters }: Props) {
    // const userAgent = (await headers()).get("user-agent") || "";
    // const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
    const isMobile = useIsMobile();

    const itemsPerRow = isMobile ? 3 : 5;
    const rowOffset = 5;

    const rows: string[][] = [];
    for (let i = 0; i < posters.length; i += itemsPerRow) {
        rows.push(posters.slice(i, i + itemsPerRow));
    }

    return (
        <div className='absolute inset-0 overflow-hidden bg-black'>
            <motion.div
                className='
          absolute top-0 right-0
          flex flex-col items-center gap-2
          opacity-45 blur-[0.8px]
          w-[180vw] sm:w-[160vw] md:w-[180vw]
        '
                style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'top right',
                    transform:
                        'perspective(1200px) translateX(5%) translateY(-5%) rotateY(-14deg) rotateX(2deg) scale(1)',
                    minHeight: '120vh',
                }}
                variants={containerVariants}
                initial='hidden'
                animate='show'
            >
                {rows.map((row, rowIndex) => {
                    const isOddRow = rowIndex % 2 === 1;
                    const offsetX = isOddRow ? rowOffset : -rowOffset;

                    return (
                        <motion.div
                            key={rowIndex}
                            className={`grid gap-2 w-full max-w-none ${isMobile ? 'grid-cols-3' : 'grid-cols-5'}`}
                            style={{
                                transform: `translateX(${offsetX}%) translateZ(${
                                    (rowIndex % 3) * 6
                                }px) scale(${1 - rowIndex * 0.02})`,
                            }}
                            variants={rowVariants}
                        >
                            {row.map((url, i) => (
                                <motion.div
                                    key={`${rowIndex}-${i}`}
                                    className='relative aspect-[2/3] overflow-hidden rounded-md shadow-[0_0_12px_rgba(0,0,0,0.4)]'
                                    variants={posterVariants}
                                >
                                    <Image
                                        src={url}
                                        alt={`poster ${rowIndex}-${i}`}
                                        fill
                                        sizes='(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw'
                                        className='object-cover brightness-[0.9] contrast-[1.1]'
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Original fade overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-transparent via-black/30 to-black pointer-events-none' />
            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none' />
        </div>
    );
}
