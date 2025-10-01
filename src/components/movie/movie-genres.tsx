import { motion } from "motion/react";
import { Genre } from "@prisma/client";

export type MovieGenresProps = {
  genres: Genre[];
  idSuffix: string;
};

export const MovieGenres = ({ genres, idSuffix }: MovieGenresProps) => {
  return (
    <motion.div
      layoutId={`genres-${idSuffix}`}
      className="flex flex-wrap gap-1 mt-1"
    >
      {genres?.map((g) => (
        <span
          key={g.id}
          className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full"
        >
          {g.name}
        </span>
      ))}
    </motion.div>
  );
};
