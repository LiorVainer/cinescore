"use client";

import {motion} from "motion/react";
import type {MovieWithGenres} from "@/models/movies.model";

export type CollapsedMovieCardProps = {
    // movie is not used in the collapsed view; omit to keep props minimal
    title: string;
    description: string;
    imgSrc: string;
    idSuffix: string; // from useId()
    ctaText: string;
    className?: string;
    onClickAction: () => void; // open handler (renamed for Next.js client props rule)
};

export default function CollapsedMovieCard({
                                               title,
                                               description,
                                               imgSrc,
                                               idSuffix,
                                               ctaText,
                                               className,
                                               onClickAction,
                                           }: CollapsedMovieCardProps) {
    return (
        <motion.div
            layoutId={`card-${title}-${idSuffix}`}
            key={`card-${title}-${idSuffix}`}
            onClick={onClickAction}
            className={[
                `p-4 flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer`,
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div
                className={`flex gap-4  w-full`}
            >
                <motion.div layoutId={`image-${title}-${idSuffix}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        width={100}
                        height={100}
                        src={imgSrc}
                        alt={title}
                        className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                    />
                </motion.div>
                <div className="flex-1 min-w-0">
                    <motion.h3
                        layoutId={`title-${title}-${idSuffix}`}
                        className={`font-medium text-neutral-800 dark:text-neutral-200  truncate`}
                        title={title}
                    >
                        {title}
                    </motion.h3>
                    <motion.p
                        layoutId={`description-${description}-${idSuffix}`}
                        className={`text-neutral-600 dark:text-neutral-400  truncate`}
                        title={description}
                    >
                        {description}
                    </motion.p>
                </div>
            </div>
            <motion.button
                layoutId={`button-${title}-${idSuffix}`}
                className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
                {ctaText}
            </motion.button>
        </motion.div>
    );
}
