"use client";

import React from "react";
import {motion} from "motion/react";
import type {MovieWithGenres} from "@/models/movies.model";
import {CloseIcon} from "./movie-card-utils";
import {MovieGenres} from "@/components/movie/movie-genres";
import {ImdbLogo} from "./imdb-logo";
import {Star, Users} from "lucide-react";

export type ExpandedMovieCardProps = {
    movie: MovieWithGenres;
    imgSrc: string;
    idSuffix: string; // from useId()
    ctaText: string;
    imdbUrl?: string;
    onClose: () => void;
};

const ExpandedMovieCard = React.forwardRef<HTMLDivElement, ExpandedMovieCardProps>(
    (
        {movie, imgSrc, idSuffix, ctaText, imdbUrl, onClose},
        ref
    ) => {
        const {title, releaseDate, rating, votes, genres} = movie;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;
        const ratingText = rating != null ? rating.toFixed(1) : "N/A";
        const votesText = votes != null ? Intl.NumberFormat().format(votes) : undefined;

        return (
            <div className="fixed inset-0 grid place-items-center z-[100]">
                <motion.button
                    key={`button-${title}-${idSuffix}`}
                    layout
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0, transition: {duration: 0.05}}}
                    className={`flex absolute top-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6`}
                    onClick={onClose}
                >
                    <CloseIcon/>
                </motion.button>

                <motion.div
                    layoutId={`card-${title}-${idSuffix}`}
                    ref={ref}
                    className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                >
                    <motion.div layoutId={`image-${title}-${idSuffix}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            width={200}
                            height={200}
                            src={imgSrc}
                            alt={title}
                            className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                        />
                    </motion.div>

                    <div>
                        <div
                            className={`flex justify-between items-start p-4 gap-4`}
                        >
                            <div className="flex-1 flex flex-col min-w-0 gap-4">
                                <div>
                                    <motion.h3
                                        layoutId={`title-${title}-${idSuffix}`}
                                        className={`font-bold text-neutral-700 dark:text-neutral-200 truncate`}
                                        title={title}
                                    >
                                        {title} {year && `(${year})`}
                                    </motion.h3>
                                    <MovieGenres genres={genres} idSuffix={idSuffix}/>
                                </div>


                                <motion.p className={`text-neutral-600 dark:text-neutral-400`}
                                          layoutId={`description-${idSuffix}`}>
                                    {movie.description}
                                </motion.p>

                                <div className="mt-3 flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <ImdbLogo className="w-6 h-6" height={30} width={30}/>
                                        <span className="sr-only">IMDb rating</span>
                                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor"/>
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
                            </div>

                            {imdbUrl ? (
                                <motion.a
                                    layoutId={`button-${title}-${idSuffix}`}
                                    href={imdbUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white whitespace-nowrap"
                                >
                                    {ctaText}
                                </motion.a>
                            ) : (
                                <motion.button
                                    layoutId={`button-${title}-${idSuffix}`}
                                    className="px-4 py-3 text-sm rounded-full font-bold bg-gray-100 text-black whitespace-nowrap"
                                    onClick={onClose}
                                >
                                    Close
                                </motion.button>
                            )}
                        </div>

                        {/* Content area reserved for future details */}
                        <div className="relative px-4 pb-4"/>
                    </div>
                </motion.div>
            </div>
        );
    }
);

ExpandedMovieCard.displayName = "ExpandedMovieCard";

export default ExpandedMovieCard;
