import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BIRTHDAY } from './birthday.config';

/**
 * Guards the photo wiring. A typo or a case mismatch in any of these paths
 * shows up as a broken tile on her phone and nowhere else, so it's worth
 * catching here — especially since the source files were named inconsistently
 * (COuple7.jpeg, TheTImeiProposedyou.jpeg) and case only bites once deployed.
 */
describe('photo config', () => {
  const publicDir = join(process.cwd(), 'public');
  const all = BIRTHDAY.albums.flatMap((a) => a.photos);

  const onDisk = (src: string) => {
    const rel = src.replace(/^\//, '');
    if (!existsSync(join(publicDir, rel))) return false;

    // existsSync is case-insensitive on Windows; compare the real entry name
    // so a deploy to a case-sensitive host can't surprise us.
    const parts = rel.split('/');
    const file = parts.pop()!;
    return readdirSync(join(publicDir, ...parts)).includes(file);
  };

  it('has at least one album with photos in it', () => {
    expect(BIRTHDAY.albums.length).toBeGreaterThan(0);
    expect(all.length).toBeGreaterThan(0);
  });

  it('points every photo at the generated /photos/ folder', () => {
    for (const photo of all) {
      expect(photo.src.startsWith('/photos/')).toBe(true);
    }
  });

  it('resolves every photo to a real file, with matching case', () => {
    const missing = all.map((p) => p.src).filter((src) => !onDisk(src));
    expect(missing).toEqual([]);
  });

  it('resolves the cover photo', () => {
    expect(onDisk(BIRTHDAY.cover.src)).toBe(true);
  });

  it('shows no photo twice', () => {
    const seen = all.map((p) => p.src);
    expect(seen.length).toBe(new Set(seen).size);
  });

  it('gives every photo a caption', () => {
    for (const photo of all) {
      expect(photo.caption.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps tilts subtle enough to still read as a photo wall', () => {
    for (const photo of all) {
      expect(Math.abs(photo.tilt ?? 0)).toBeLessThanOrEqual(6);
    }
  });
});
