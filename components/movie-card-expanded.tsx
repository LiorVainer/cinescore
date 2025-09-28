"use client";

import React from "react";
import {motion} from "motion/react";
import type {MovieWithGenres} from "@/models/movies.model";
import {CloseIcon, RenderDetails} from "./movie-card-utils";

export type ExpandedMovieCardProps = {
    movie: MovieWithGenres;
    title: string;
    description: string;
    imgSrc: string;
    idSuffix: string; // from useId()
    ctaText: string;
    imdbUrl?: string;
    onClose: () => void;
};

const ExpandedMovieCard = React.forwardRef<HTMLDivElement, ExpandedMovieCardProps>(
    (
        {movie, title, description, imgSrc, idSuffix, ctaText, imdbUrl, onClose},
        ref
    ) => {
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
                            <div className="">
                                <motion.h3
                                    layoutId={`title-${title}-${idSuffix}`}
                                    className={`font-bold text-neutral-700 dark:text-neutral-200`}
                                >
                                    {title}
                                </motion.h3>
                                <motion.p
                                    layoutId={`description-${description}-${idSuffix}`}
                                    className={`text-neutral-600 dark:text-neutral-400`}
                                >
                                    {description}
                                </motion.p>
                            </div>

                            {imdbUrl ? (
                                <motion.a
                                    layoutId={`button-${title}-${idSuffix}`}
                                    href={imdbUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                                >
                                    {ctaText}
                                </motion.a>
                            ) : (
                                <motion.button
                                    layoutId={`button-${title}-${idSuffix}`}
                                    className="px-4 py-3 text-sm rounded-full font-bold bg-gray-100 text-black"
                                    onClick={onClose}
                                >
                                    Close
                                </motion.button>
                            )}
                        </div>

                        <div className={`px-4 flex flex-wrap gap-2`}>
                            {movie.genres?.map((g) => (
                                <span
                                    key={g.id}
                                    className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full"
                                >
                  {g.name}
                </span>
                            ))}
                        </div>

                        <div className="pt-4 relative px-4">
                            <motion.div
                                layout
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                className={`text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-2 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]`}
                            >
                                <p>{movie.description}</p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }
);

ExpandedMovieCard.displayName = "ExpandedMovieCard";

export default ExpandedMovieCard;

