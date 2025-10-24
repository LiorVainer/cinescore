"use client";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import {useLocale, useTranslations} from "next-intl";
import MovieVerticalCard from "@/components/movie/MovieVerticalCard";

// 🔍 Detect mobile
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < breakpoint);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [breakpoint]);
    return isMobile;
}

type MovieSlide = {
    title: string;
    posterUrl?: string | null;
    imdbRating?: number | null;
    onClick?: (e: React.MouseEvent) => void;
};

interface MovieCarouselProps {
    movies: MovieSlide[];
}

export function MovieCarousel({ movies }: MovieCarouselProps) {
    const listRef = useRef<HTMLUListElement | null>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [cardWidth, setCardWidth] = useState(0);
    const locale = useLocale();
    const isRTL = locale === "he";
    const isMobile = useIsMobile();

    // Measure first card
    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list) return;
        const measure = () => {
            const first = list.querySelector("li") as HTMLElement | null;
            if (first) setCardWidth(first.offsetWidth + 12);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [movies]);

    // Update button visibility
    const updateButtons = () => {
        const list = listRef.current;
        if (!list) return;
        const { scrollLeft, scrollWidth, clientWidth } = list;
        const normalized = isRTL ? Math.abs(scrollLeft) : scrollLeft;
        const maxScroll = scrollWidth - clientWidth;
        const buffer = 20;
        setCanScrollPrev(normalized > buffer);
        setCanScrollNext(normalized < maxScroll - buffer);
    };

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        list.addEventListener("scroll", updateButtons, { passive: true });
        window.addEventListener("resize", updateButtons);
        updateButtons();
        return () => {
            list.removeEventListener("scroll", updateButtons);
            window.removeEventListener("resize", updateButtons);
        };
    }, [movies, isRTL]);

    const visibleCards = isMobile ? 2 : 5;
    const scrollByCards = (cards: number) => {
        const list = listRef.current;
        if (!list || !cardWidth) return;
        const distance = cards * cardWidth;
        const adjusted = isRTL ? -distance : distance;
        list.scrollBy({ left: adjusted, behavior: "smooth" });
    };

    const t = useTranslations('general');

    const handlePrev = () => scrollByCards(-visibleCards);
    const handleNext = () => scrollByCards(visibleCards);


    if (!movies?.length) return null;

    return (
        <div
            className="flex gap-2 md:gap-4 justify-center"
            style={{
                direction: isRTL ? "rtl" : "ltr",
            }}
        >
            <motion.button
                onClick={handlePrev}
                aria-label="Previous"
                animate={{
                    opacity: canScrollPrev ? 1 : 0,
                    scale: canScrollPrev ? 1 : 0.8,
                    x: canScrollPrev ? 0 : isRTL ? 10 : -10, // slide out slightly
                }}
                transition={{
                    duration: 0.35,
                    ease: "easeInOut",
                }}
                className="px-2 bg-black text-white rounded-md flex items-center justify-center gap-2 cursor-pointer"
                style={{
                    pointerEvents: canScrollPrev ? "auto" : "none",
                }}
            >
                <IconArrowNarrowRight
                    className={`w-5 h-5 ${isRTL ? "" : "rotate-180"}`}
                />
            </motion.button>
            <ul
                ref={listRef}
                className="flex overflow-x-auto no-scrollbar px-1 gap-4 md:gap-8 scroll-smooth touch-pan-x items-center flex-1 "
                style={{
                    scrollSnapType: "x mandatory",
                    listStyle: "none",
                }}
            >
                {movies.map((slide, i) => (
                    <li
                        key={i}
                        className="flex-none snap-start"
                        style={{
                            // width: `calc(${100 / (isMobile ? 2 : 5)}% - 0.5rem)`,
                            flex: `0 0 calc(${100 / (isMobile ? 2 : 5)}% - 0.5rem)`,
                        }}
                    >
                        <MovieVerticalCard
                            title={slide.title}
                            posterUrl={slide.posterUrl}
                            imdbRating={slide.imdbRating}
                            onClick={slide.onClick}
                            className="h-full"
                        />
                    </li>
                ))}
            </ul>

            <motion.button
                onClick={handleNext}
                aria-label="Next"
                animate={{
                    opacity: canScrollNext ? 1 : 0,
                    scale: canScrollNext ? 1 : 0.8,
                    x: canScrollNext ? 0 : isRTL ? -10 : 10,
                }}
                transition={{
                    duration: 0.35,
                    ease: "easeInOut",
                }}
                className="px-2 bg-black text-white rounded-md flex items-center justify-center gap-2 cursor-pointer"
                style={{
                    pointerEvents: canScrollNext ? "auto" : "none",
                }}
            >
                <IconArrowNarrowRight
                    className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                />
            </motion.button>

        </div>
    );
}

export default MovieCarousel;
