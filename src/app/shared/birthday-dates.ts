/** Date maths for the countdown, derived from her actual birth date. */

export type Phase = 'before' | 'today' | 'just-after';

/** Parses 'YYYY-MM-DD' as local midnight (not UTC, which would shift the day). */
export function localMidnight(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * The next time her birthday comes around — today if it *is* today, otherwise
 * this year's or next year's, whichever is still ahead. Means the site keeps
 * working every year with no edits.
 */
export function nextBirthday(birthISO: string, now: Date): Date {
  const birth = localMidnight(birthISO);
  const thisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (sameDay(now, thisYear) || now < thisYear) return thisYear;
  return new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
}

/** Which birthday she's celebrating at `nextBirthday`. */
export function turningAge(birthISO: string, now: Date): number {
  return nextBirthday(birthISO, now).getFullYear() - localMidnight(birthISO).getFullYear();
}

/**
 * `'today'` on the day itself, `'just-after'` for a few days of afterglow, and
 * `'before'` the rest of the year while the countdown runs.
 */
export function phaseFor(birthISO: string, now: Date, graceDays = 3): Phase {
  const target = nextBirthday(birthISO, now);
  if (sameDay(now, target)) return 'today';

  const birth = localMidnight(birthISO);
  const mostRecent = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (mostRecent > now) mostRecent.setFullYear(mostRecent.getFullYear() - 1);

  const daysSince = (now.getTime() - mostRecent.getTime()) / 86_400_000;
  return daysSince <= graceDays ? 'just-after' : 'before';
}
