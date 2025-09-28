"use client";

import {motion} from "motion/react";
import type {MovieWithGenres} from "@/models/movies.model";
import {ImdbLogo} from "./imdb-logo";
import {MovieGenres} from "@/components/movie/movie-genres";
import {Star, Users} from "lucide-react";

export type CollapsedMovieCardProps = {
    movie: MovieWithGenres;
    imgSrc: string;
    idSuffix: string; // from useId()
    className?: string;
    onClickAction: () => void; // open handler (renamed for Next.js client props rule)
};

export default function CollapsedMovieCard({
                                               imgSrc,
                                               idSuffix,
                                               movie,
                                               className,
                                               onClickAction,
                                           }: CollapsedMovieCardProps) {
    const {title, releaseDate, rating, votes} = movie;

    const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;
    const ratingText = rating != null ? rating.toFixed(1) : "N/A";
    const votesText = votes != null ? Intl.NumberFormat().format(votes) : undefined;

    return (
        <motion.div
            layoutId={`card-${title}-${idSuffix}`}
            key={`card-${title}-${idSuffix}`}
            onClick={onClickAction}
            className={[
                "p-4 flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="flex gap-4 flex-col w-full">
                <motion.div layoutId={`image-${title}-${idSuffix}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imgSrc}
                        alt={title}
                        className="w-full max-h-60 rounded-lg object-cover object-top"
                    />
                </motion.div>

                <div className="flex-1 min-w-0">
                    <motion.h3
                        layoutId={`title-${title}-${idSuffix}`}
                        className="font-medium text-neutral-800 dark:text-neutral-200 truncate"
                        title={title}
                    >
                        {title} {year && `(${year})`}
                    </motion.h3>

                    <MovieGenres genres={movie.genres} idSuffix={idSuffix}/>

                    <motion.div
                        layoutId={`description-${idSuffix}`}
                        className="text-neutral-600 dark:text-neutral-400 truncate mt-2"
                    >
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="sr-only">IMDb rating</span>
                                <ImdbLogo className="w-8 h-6" height={30} width={30}/>
                                <Star className="w-3 h-3 text-yellow-400" fill="currentColor"/>
                                <span>{ratingText}</span>
                            </div>

                            {votesText && (
                                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                                    <Users className="w-4 h-4"/>
                                    <span className="sr-only">Votes</span>
                                    <span>{votesText}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
