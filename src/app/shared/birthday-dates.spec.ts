import { nextBirthday, phaseFor, turningAge } from './birthday-dates';

const BIRTH = '2005-08-11';

/** Local-time date helper so these assertions don't drift with the timezone. */
const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);

describe('birthday dates', () => {
  it('counts down to this year\'s birthday when it is still ahead', () => {
    expect(nextBirthday(BIRTH, at(2026, 8, 7))).toEqual(at(2026, 8, 11, 0));
  });

  it('targets the day itself, not next year, on the birthday', () => {
    expect(nextBirthday(BIRTH, at(2026, 8, 11))).toEqual(at(2026, 8, 11, 0));
  });

  it('rolls over to next year once the day has passed', () => {
    expect(nextBirthday(BIRTH, at(2026, 8, 20))).toEqual(at(2027, 8, 11, 0));
  });

  it('works out which birthday she is turning', () => {
    expect(turningAge(BIRTH, at(2026, 8, 7))).toBe(21);
    expect(turningAge(BIRTH, at(2026, 8, 11))).toBe(21);
    expect(turningAge(BIRTH, at(2026, 8, 20))).toBe(22);
  });

  it('reports the right phase around the day', () => {
    expect(phaseFor(BIRTH, at(2026, 8, 7))).toBe('before');
    expect(phaseFor(BIRTH, at(2026, 8, 11))).toBe('today');
    expect(phaseFor(BIRTH, at(2026, 8, 13))).toBe('just-after');
    expect(phaseFor(BIRTH, at(2026, 8, 20))).toBe('before');
  });

  it('handles January, where the previous birthday was last year', () => {
    expect(phaseFor(BIRTH, at(2027, 1, 4))).toBe('before');
    expect(turningAge(BIRTH, at(2027, 1, 4))).toBe(22);
  });
});
