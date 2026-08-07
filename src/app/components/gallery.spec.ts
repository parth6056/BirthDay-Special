import { TestBed } from '@angular/core/testing';
import { BIRTHDAY } from '../birthday.config';
import { Gallery } from './gallery';

/** Minimal stand-in — jsdom has no TouchEvent constructor. */
function touch(x: number, y: number) {
  return {
    changedTouches: [{ clientX: x, clientY: y }],
    stopPropagation: () => {},
  } as unknown as TouchEvent;
}

describe('Gallery', () => {
  let gallery: any;
  const total = BIRTHDAY.albums.reduce((n, a) => n + a.photos.length, 0);
  const last = total - 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Gallery] }).compileComponents();
    gallery = TestBed.createComponent(Gallery).componentInstance;
  });

  it('opens and closes the lightbox', () => {
    expect(gallery.openIndex()).toBeNull();
    gallery.openAt(2);
    expect(gallery.openIndex()).toBe(2);
    gallery.close();
    expect(gallery.openIndex()).toBeNull();
  });

  it('flattens every album into one continuous run of photos', () => {
    expect(gallery.total).toBe(total);
    expect(gallery.offsets[0]).toBe(0);

    // Each album must start exactly where the previous one ended.
    BIRTHDAY.albums.forEach((album, i) => {
      const start = gallery.offsets[i];
      gallery.openAt(start);
      expect(gallery.current().src).toBe(album.photos[0].src);
      expect(gallery.current().src).toBe(gallery.flat[start].src);
    });

    const lastAlbum = BIRTHDAY.albums[BIRTHDAY.albums.length - 1];
    expect(gallery.offsets.at(-1) + lastAlbum.photos.length).toBe(total);
  });

  it('walks across an album boundary without a gap', () => {
    const boundary = gallery.offsets[1];
    gallery.openAt(boundary - 1);
    gallery.step(1, new Event('click'));
    expect(gallery.current().src).toBe(BIRTHDAY.albums[1].photos[0].src);
  });

  it('wraps around at both ends instead of dead-ending', () => {
    gallery.openAt(last);
    gallery.step(1, new Event('click'));
    expect(gallery.openIndex()).toBe(0);

    gallery.step(-1, new Event('click'));
    expect(gallery.openIndex()).toBe(last);
  });

  it('advances on a swipe left and goes back on a swipe right', () => {
    gallery.openAt(1);

    gallery.onTouchStart(touch(300, 200));
    gallery.onTouchEnd(touch(180, 210));
    expect(gallery.openIndex()).toBe(2);

    gallery.onTouchStart(touch(180, 200));
    gallery.onTouchEnd(touch(300, 190));
    expect(gallery.openIndex()).toBe(1);
  });

  it('ignores a vertical drag so scrolling does not change the photo', () => {
    gallery.openAt(1);
    gallery.onTouchStart(touch(200, 100));
    gallery.onTouchEnd(touch(230, 400));
    expect(gallery.openIndex()).toBe(1);
  });

  it('ignores a tiny drag so a tap does not change the photo', () => {
    gallery.openAt(1);
    gallery.onTouchStart(touch(200, 200));
    gallery.onTouchEnd(touch(212, 203));
    expect(gallery.openIndex()).toBe(1);
  });

  it('falls back to a placeholder when a photo file is missing', () => {
    expect(gallery.broken().has(0)).toBe(false);
    gallery.markBroken(0);
    expect(gallery.broken().has(0)).toBe(true);
  });
});
