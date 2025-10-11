import {useTranslations} from 'next-intl';
import dayjs from 'dayjs';

interface RelativeDateProps {
    date?: Date | string | null;
    className?: string;
}

export function RelativeDate({ date, className }: RelativeDateProps) {
    const t = useTranslations('dates');

    if (!date) return null;

    const rel = dayjs(date);
    if (!rel.isValid()) return null;

    const now = dayjs();
    const diffDays = now.diff(rel, 'day');

    // Same day
    if (diffDays === 0) {
        return <span className={className}>{t('today')}</span>;
    }

    if (diffDays > 0) {
        // Past dates
        if (diffDays < 14) {
            return <span className={className}>{t('daysAgo', { count: diffDays })}</span>;
        }
        if (diffDays < 60) {
            const weeks = Math.max(1, Math.floor(diffDays / 7));
            return <span className={className}>{t('weeksAgo', { count: weeks })}</span>;
        }
        const months = Math.abs(now.diff(rel, 'month'));
        if (months < 12) {
            const m = Math.max(1, months);
            return <span className={className}>{t('monthsAgo', { count: m })}</span>;
        }
        const years = Math.abs(now.diff(rel, 'year'));
        const y = Math.max(1, years);
        return <span className={className}>{t('yearsAgo', { count: y })}</span>;
    } else {
        // Future dates
        const daysAhead = Math.abs(diffDays);
        if (daysAhead < 14) {
            return <span className={className}>{t('inDays', { count: daysAhead })}</span>;
        }
        if (daysAhead < 60) {
            const weeksAhead = Math.max(1, Math.floor(daysAhead / 7));
            return <span className={className}>{t('inWeeks', { count: weeksAhead })}</span>;
        }
        const monthsAhead = Math.abs(now.diff(rel, 'month'));
        if (monthsAhead < 12) {
            const mA = Math.max(1, monthsAhead);
            return <span className={className}>{t('inMonths', { count: mA })}</span>;
        }
        const yearsAhead = Math.abs(now.diff(rel, 'year'));
        const yA = Math.max(1, yearsAhead);
        return <span className={className}>{t('inYears', { count: yA })}</span>;
    }
}
