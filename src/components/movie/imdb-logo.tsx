import Image from 'next/image';

export type ImdbLogoProps = {
    width?: number;
    height?: number;
    className?: string;
};

export function ImdbLogo({ width = 120, height = 60, className }: ImdbLogoProps) {
    return <Image className={className} src='/imdb-logo.svg' alt='IMDb Logo' width={width} height={height} />;
}
