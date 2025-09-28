"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { MovieWithGenres } from "@/models/movies.model";
import CollapsedMovieCard from "./movie-card-collapsed";
import ExpandedMovieCard from "./movie-card-expanded";
import { buildSubtitle } from "./movie-card-utils";

export type MovieCardProps = {
  movie: MovieWithGenres;
  // Optional CTA override. If not provided and movie.id looks like an IMDb id (ttXXXX), we link to IMDb.
  ctaText?: string;
  ctaHref?: string;
  className?: string;
  // Direction for RTL/LTR layout
  dir?: "rtl" | "ltr";
};

export default function MovieCard({
  movie,
  ctaText = "Details",
  ctaHref,
  className,
  dir = "ltr",
}: MovieCardProps) {
  const [active, setActive] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const isRTL = dir === "rtl";

  const imgSrc = movie.posterUrl || "/window.svg"; // fallback asset from public/
  const imdbUrl =
    ctaHref ??
    (movie.id?.startsWith("tt")
      ? `https://www.imdb.com/title/${movie.id}/`
      : undefined);
  const title = movie.title;
  const description = buildSubtitle(movie);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(false));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <ExpandedMovieCard
            ref={ref}
            movie={movie}
            title={title}
            description={description}
            imgSrc={imgSrc}
            idSuffix={id}
            isRTL={isRTL}
            dir={dir}
            ctaText={ctaText}
            imdbUrl={imdbUrl}
            onClose={() => setActive(false)}
          />
        ) : null}
      </AnimatePresence>

      <CollapsedMovieCard
        title={title}
        description={description}
        imgSrc={imgSrc}
        idSuffix={id}
        ctaText={ctaText}
        className={className}
        onClickAction={() => setActive(true)}
      />
    </>
  );
}
