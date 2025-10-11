import {useTranslations} from "next-intl";
import Link from "next/link";
import Logo from "@/assets/logo.svg";
import {motion} from "motion/react";
import React from "react";

export const NavbarLogo = () => {
    const t = useTranslations("app");
    return (
        <Link
            href="/"
            className="relative z-20 flex flex-row items-center gap-2 text-lg font-bold text-black dark:text-white"
        >
            <Logo className="text-foreground [--star-color:#FFD700] w-7 h-7"/>
            <motion.span
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="whitespace-pre text-base"
            >
                {t("title")}
            </motion.span>
        </Link>
    );
};