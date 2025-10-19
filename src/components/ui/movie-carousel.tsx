"use client";
import {IconArrowNarrowRight} from "@tabler/icons-react";
import {useState, useRef, useId, useEffect} from "react";
import { useLocale } from "next-intl";
import MovieVerticalCard from '@/components/movie/MovieVerticalCard';

type MovieSlide = {
    title: string;
    posterUrl?: string | null;
    imdbRating?: number | null;
    onClick?: (e: React.MouseEvent) => void;
};

interface SlideProps {
    slide: MovieSlide;
    index: number;
    current: number;
    handleSlideClick: (index: number) => void;
}

const Slide = ({slide, index, current, handleSlideClick}: SlideProps) => {
    const slideRef = useRef<HTMLLIElement>(null);

    const xRef = useRef(0);
    const yRef = useRef(0);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        const animate = () => {
            if (!slideRef.current) return;

            const x = xRef.current;
            const y = yRef.current;

            slideRef.current.style.setProperty("--x", `${x}px`);
            slideRef.current.style.setProperty("--y", `${y}px`);

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    const handleMouseMove = (event: React.MouseEvent) => {
        const el = slideRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
        yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
    };

    const handleMouseLeave = () => {
        xRef.current = 0;
        yRef.current = 0;
    };

    return (
        <li
            ref={slideRef}
            className="flex-none h-fit z-10 relative"
            onClick={() => handleSlideClick(index)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                // width: 'calc(33.333% - 1rem)',
                transform:
                    current !== index
                        ? "scale(0.98) rotateX(4deg)"
                        : "scale(1) rotateX(0deg)",
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                transformOrigin: "bottom",
            }}
        >
            {/* debug index badge */}
            <div className="absolute top-2 left-2 z-40 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded">#{index + 1}</div>

            <div className="relative transition-opacity duration-500 ease-in-out w-full h-full">
                <MovieVerticalCard
                    title={slide.title}
                    posterUrl={slide.posterUrl}
                    imdbRating={slide.imdbRating}
                    onClick={slide.onClick}
                    className="w-full h-full"
                />
            </div>
        </li>
    );
};

interface MovieCarouselProps {
    movies: MovieSlide[];
}

export function MovieCarousel({movies}: MovieCarouselProps) {
    const [current, setCurrent] = useState(0);
    const listRef = useRef<HTMLUListElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [slideFullWidth, setSlideFullWidth] = useState(0);
    const [gapPx, setGapPx] = useState(16); // default gap in px (use gap on ul)
    const [centerOffset, setCenterOffset] = useState(0);
    const [measured, setMeasured] = useState(false);

    // measure the first slide and gap to compute translate offset
    useEffect(() => {
        let rafId: number | null = null;
        let ro: ResizeObserver | null = null;

        const measure = () => {
            const list = listRef.current;
            const container = containerRef.current;
            if (!list || !container) return;

            const first = list.querySelector('li') as HTMLElement | null;
            if (!first) return;

            const rect = first.getBoundingClientRect();
            const style = getComputedStyle(list);
            let gap = 16;
            if (style && style.gap) {
                gap = parseFloat(style.gap) || gap;
            }

            const full = Math.round(rect.width);

            setGapPx(gap);
            setSlideFullWidth(full);

            const cWidth = Math.round(container.getBoundingClientRect().width || 0);

            // center offset so the active slide's left aligns to this value
            const center = Math.round((cWidth - full) / 2);
            setCenterOffset(center);
            console.debug('[MovieCarousel] measured slideWidth=', full, 'gap=', gap, 'containerWidth=', cWidth, 'centerOffset=', center);

            setMeasured(true);
        };

        const schedule = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(measure);
        };

        // initial measurement after mount
        schedule();

        // observe container/list resizes
        try {
            ro = new ResizeObserver(schedule);
            if (containerRef.current) ro.observe(containerRef.current);
            if (listRef.current) ro.observe(listRef.current);
        } catch (e) {
            // ResizeObserver might not be available in some environments; fall back to resize event
            window.addEventListener('resize', schedule);
        }

        // also remeasure when images inside the list load
        const onImgLoad = () => schedule();
        const imgs = listRef.current ? Array.from(listRef.current.querySelectorAll('img')) : [];
        imgs.forEach((img) => img.addEventListener('load', onImgLoad));

        // ensure we re-measure after page load (images may finish later)
        window.addEventListener('load', schedule);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (ro) ro.disconnect();
            window.removeEventListener('resize', schedule);
            window.removeEventListener('load', schedule);
            imgs.forEach((img) => img.removeEventListener('load', onImgLoad));
        };
    }, [movies]);

    const handlePreviousClick = () => {
        if (!measured) {
            // fallback: scroll left by one slide (if list is scrollable)
            const list = listRef.current;
            if (!list) return;
            list.scrollBy({left: -(slideFullWidth || 300) - (gapPx || 16), behavior: 'smooth'});
            console.debug('[MovieCarousel] fallback scroll left', {slideFullWidth, gapPx});
            return;
        }

        const previous = current - 1;
        setCurrent(previous < 0 ? 0 : previous);
        console.debug('[MovieCarousel] goto index', Math.max(0, current-1));
    };

    const handleNextClick = () => {
        if (!measured) {
            // fallback: scroll right by one slide
            const list = listRef.current;
            if (!list) return;
            list.scrollBy({left: (slideFullWidth || 300) + (gapPx || 16), behavior: 'smooth'});
            console.debug('[MovieCarousel] fallback scroll right', {slideFullWidth, gapPx});
            return;
        }

        const next = current + 1;
        setCurrent(next >= movies.length ? movies.length - 1 : next);
        console.debug('[MovieCarousel] goto index', Math.min(movies.length-1, current+1));
    };

    const handleSlideClick = (index: number) => {
        // allow selecting a slide even before measurement; if measured we'll center it
        if (current !== index) {
            setCurrent(index);
        }
    };

    const id = useId();
    const locale = useLocale();
    const isRTL = locale === 'he';

    if (!movies || movies.length === 0) return null;

    // compute offset in px; CENTER the active slide inside the container
    const offset = current * (slideFullWidth + gapPx);
    // translate so the active slide's left edge is at `centerOffset` (center of container)
    const translateX = Math.round(isRTL ? offset - centerOffset : -offset + centerOffset);

    return (
        <div ref={containerRef} className="relative w-full overflow-visible mx-auto" aria-labelledby={`carousel-heading-${id}`}>
            <ul
                ref={listRef}
                className={`flex items-stretch h-fit gap-8 ${measured ? 'transition-transform duration-700 ease-in-out' : 'overflow-x-auto'}`}
                style={{
                    transform: measured ? `translateX(${translateX}px)` : 'none',
                    padding: 0,
                    margin: 0,
                    border: '2px solid rgba(99,102,241,0.08)', // stronger debug border
                    background: 'linear-gradient(180deg, rgba(255,255,0,0.02), transparent)', // faint tint to highlight area
                    listStyle: 'none',
                }}
            >
                {movies.map((slide, index) => (
                    <Slide
                        key={index}
                        slide={slide}
                        index={index}
                        current={current}
                        handleSlideClick={handleSlideClick}
                    />
                ))}
            </ul>

            <div
                aria-hidden={!measured}
                style={{
                    position: 'absolute',
                    left: isRTL ? undefined : 12,
                    right: isRTL ? 12 : undefined,
                    bottom: '0',
                    transform: 'translateY(-50%)',
                    zIndex: 50,
                }}
            >
                <button
                    onClick={handlePreviousClick}
                    aria-label="Previous"
                    disabled={current === 0}
                    className={`w-12 h-12 flex items-center justify-center rounded-full shadow-2xl ring-2 ring-white/20
      ${current === 0
                        ? 'bg-neutral-700/50 text-white/40 cursor-not-allowed'
                        : 'bg-neutral-900 text-white hover:scale-105 transition'}`}
                >
                    <IconArrowNarrowRight className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} />
                </button>
            </div>

            {/* Next Button */}
            <div
                aria-hidden={!measured}
                style={{
                    position: 'absolute',
                    right: isRTL ? undefined : 12,
                    left: isRTL ? 12 : undefined,
                    bottom: '0',
                    transform: 'translateY(-50%)',
                    zIndex: 50,
                }}
            >
                <button
                    onClick={handleNextClick}
                    aria-label="Next"
                    disabled={current === movies.length - 1}
                    className={`w-12 h-12 flex items-center justify-center rounded-full shadow-2xl ring-2 ring-white/20
      ${current === movies.length - 1
                        ? 'bg-neutral-700/50 text-white/40 cursor-not-allowed'
                        : 'bg-neutral-900 text-white hover:scale-105 transition'}`}
                >
                    <IconArrowNarrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
            </div>
         </div>
     );
 }

 export default MovieCarousel;
