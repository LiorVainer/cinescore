'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroActions() {
    const t = useTranslations('landing');
    const locale = useLocale();
    const isRTL = locale === 'he';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className='mt-10 flex flex-col sm:flex-row gap-4'
        >
            <Link href='/now-playing'>
                <Button
                    size='lg'
                    className='bg-primary text-primary-foreground font-semibold px-8 py-3 hover:brightness-110 transition-all shadow-lg'
                >
                    {t('cta_now_playing')}
                    <ArrowRight className={cn('w-6 h-6', isRTL ? 'rotate-180' : '')} /> {/* ← left arrow icon */}
                </Button>
            </Link>

            <Link href='/auth/sign-in'>
                <Button
                    size='lg'
                    variant='outline'
                    className='border border-primary text-primary hover:bg-primary hover:text-foreground transition-all'
                >
                    {t('cta_subscribe')}
                </Button>
            </Link>
        </motion.div>
    );
}
