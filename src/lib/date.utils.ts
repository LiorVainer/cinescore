import dayjs from 'dayjs';
import {Language} from '@prisma/client';

/**
 * Format a human-friendly relative time in both Hebrew and English
 * Uses next-intl compatible format for better integration
 */
export function formatSinceDate(input?: Date | string | null, language: Language = Language.he_IL): string | undefined {
    if (!input) return undefined;
    const rel = dayjs(input);
    if (!rel.isValid()) return undefined;

    const now = dayjs();
    const diffDays = now.diff(rel, 'day');

    // Same day
    if (diffDays === 0) {
        return language === Language.he_IL ? 'היום' : 'Today';
    }

    if (language === Language.he_IL) {
        // Hebrew labels
        const dayLabel = (n: number) => (n === 1 ? 'יום' : 'ימים');
        const weekLabel = (n: number) => (n === 1 ? 'שבוע' : 'שבועות');
        const monthLabel = (n: number) => (n === 1 ? 'חודש' : 'חודשים');
        const yearLabel = (n: number) => (n === 1 ? 'שנה' : 'שנים');

        if (diffDays > 0) {
            // Past
            if (diffDays < 14) {
                return `לפני ${diffDays} ${dayLabel(diffDays)}`;
            }
            if (diffDays < 60) {
                const weeks = Math.max(1, Math.floor(diffDays / 7));
                return `לפני ${weeks} ${weekLabel(weeks)}`;
            }
            const months = Math.abs(now.diff(rel, 'month'));
            if (months < 12) {
                const m = Math.max(1, months);
                return `לפני ${m} ${monthLabel(m)}`;
            }
            const years = Math.abs(now.diff(rel, 'year'));
            const y = Math.max(1, years);
            return `לפני ${y} ${yearLabel(y)}`;
        }

        // Future
        const daysAhead = Math.abs(diffDays);
        if (daysAhead < 14) {
            return `בעוד ${daysAhead} ${dayLabel(daysAhead)}`;
        }
        if (daysAhead < 60) {
            const weeksAhead = Math.max(1, Math.floor(daysAhead / 7));
            return `בעוד ${weeksAhead} ${weekLabel(weeksAhead)}`;
        }
        const monthsAhead = Math.abs(now.diff(rel, 'month'));
        if (monthsAhead < 12) {
            const mA = Math.max(1, monthsAhead);
            return `בעוד ${mA} ${monthLabel(mA)}`;
        }
        const yearsAhead = Math.abs(now.diff(rel, 'year'));
        const yA = Math.max(1, yearsAhead);
        return `בעוד ${yA} ${yearLabel(yA)}`;
    } else {
        // English labels
        const dayLabel = (n: number) => (n === 1 ? 'day' : 'days');
        const weekLabel = (n: number) => (n === 1 ? 'week' : 'weeks');
        const monthLabel = (n: number) => (n === 1 ? 'month' : 'months');
        const yearLabel = (n: number) => (n === 1 ? 'year' : 'years');

        if (diffDays > 0) {
            // Past
            if (diffDays < 14) {
                return `${diffDays} ${dayLabel(diffDays)} ago`;
            }
            if (diffDays < 60) {
                const weeks = Math.max(1, Math.floor(diffDays / 7));
                return `${weeks} ${weekLabel(weeks)} ago`;
            }
            const months = Math.abs(now.diff(rel, 'month'));
            if (months < 12) {
                const m = Math.max(1, months);
                return `${m} ${monthLabel(m)} ago`;
            }
            const years = Math.abs(now.diff(rel, 'year'));
            const y = Math.max(1, years);
            return `${y} ${yearLabel(y)} ago`;
        }

        // Future
        const daysAhead = Math.abs(diffDays);
        if (daysAhead < 14) {
            return `in ${daysAhead} ${dayLabel(daysAhead)}`;
        }
        if (daysAhead < 60) {
            const weeksAhead = Math.max(1, Math.floor(daysAhead / 7));
            return `in ${weeksAhead} ${weekLabel(weeksAhead)}`;
        }
        const monthsAhead = Math.abs(now.diff(rel, 'month'));
        if (monthsAhead < 12) {
            const mA = Math.max(1, monthsAhead);
            return `in ${mA} ${monthLabel(mA)}`;
        }
        const yearsAhead = Math.abs(now.diff(rel, 'year'));
        const yA = Math.max(1, yearsAhead);
        return `in ${yA} ${yearLabel(yA)}`;
    }
}
