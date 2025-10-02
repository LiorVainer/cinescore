import dayjs from 'dayjs';

/**
 * Format a human-friendly relative time in Hebrew for days/weeks/months/years since a given date.
 * - Today: "היום"
 * - Past: "לפני X יום/ימים" | "לפני X שבוע/שבועות" | "לפני X חודש/חודשים" | "לפני X שנה/שנים"
 * - Future: "בעוד X יום/ימים" | "בעוד X שבוע/שבועות" | "בעוד X חודש/חודשים" | "בעוד X שנה/שנים"
 */
export function formatSinceDate(input?: Date | string | null): string | undefined {
    if (!input) return undefined;
    const rel = dayjs(input);
    if (!rel.isValid()) return undefined;

    const now = dayjs();
    const diffDays = now.diff(rel, 'day');

    // Same day
    if (diffDays === 0) return 'היום';

    // Helpers for Hebrew pluralization (simple)
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
}
