// app/components/HeroBackground3D.tsx
import Image from 'next/image';
import { headers } from 'next/headers';

interface Props {
    posters: string[];
}

// This is a Server Component
export async function HeroBackground3D({ posters }: Props) {
    // Detect device type from User-Agent
    const userAgent = (await headers()).get('user-agent') || '';
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

    const itemsPerRow = isMobile ? 3 : 5;
    const rowOffset = 5;

    // Split posters into rows based on device type
    const rows: string[][] = [];
    for (let i = 0; i < posters.length; i += itemsPerRow) {
        rows.push(posters.slice(i, i + itemsPerRow));
    }

    return (
        <div className='absolute inset-0 overflow-hidden bg-black'>
            <div
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
            >
                {rows.map((row, rowIndex) => {
                    const isOddRow = rowIndex % 2 === 1;
                    const offsetX = isOddRow ? rowOffset : -rowOffset;

                    return (
                        <div
                            key={rowIndex}
                            className={`grid gap-2 w-full max-w-none ${isMobile ? 'grid-cols-3' : 'grid-cols-5'}`}
                            style={{
                                transform: `translateX(${offsetX}%) translateZ(${
                                    (rowIndex % 3) * 6
                                }px) scale(${1 - rowIndex * 0.02})`,
                            }}
                        >
                            {row.map((url, i) => (
                                <div
                                    key={`${rowIndex}-${i}`}
                                    className='relative aspect-[2/3] overflow-hidden rounded-md shadow-[0_0_12px_rgba(0,0,0,0.4)]'
                                >
                                    <Image
                                        src={url}
                                        alt={`poster ${rowIndex}-${i}`}
                                        fill
                                        sizes='(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw'
                                        className='object-cover brightness-[0.9] contrast-[1.1]'
                                    />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black pointer-events-none' />
        </div>
    );
}
