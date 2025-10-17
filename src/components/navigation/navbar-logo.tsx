import { useTranslations } from 'next-intl';
import Logo from '@/assets/logo.svg';
import { motion } from 'motion/react';
import React from 'react';
import { Link } from '@/i18n/navigation';

export const NavbarLogo = () => {
    const t = useTranslations('metadata');
    return (
        <Link href='/now-playing' className='relative z-20 flex flex-row items-center gap-2 text-lg font-bold'>
            <Logo className='text-foreground [--star-color:#FFD700] w-8 h-8' />
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='whitespace-pre text-base'>
                {t('title')}
            </motion.span>
        </Link>
    );
};
