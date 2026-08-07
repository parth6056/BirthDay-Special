import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { BIRTHDAY } from '../birthday.config';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-gallery',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    <section class="section" id="photos">
      <h2 class="section-title" appReveal>our little museum 📸</h2>
      <p class="section-sub" appReveal [revealDelay]="90">
        {{ total }} of my favourite things, all of them you.
      </p>

      @for (album of albums; track album.title; let ai = $index) {
        <div class="album">
          <h3 class="album-title" appReveal>{{ album.title }}</h3>
          <p class="album-blurb" appReveal [revealDelay]="70">{{ album.blurb }}</p>

          <div class="wall">
            @for (photo of album.photos; track photo.src; let pi = $index) {
              <button
                type="button"
                class="polaroid"
                appReveal
                [revealDelay]="pi * 70"
                [style.--tilt]="(photo.tilt ?? 0) + 'deg'"
                (click)="openAt(offsets[ai] + pi)"
              >
                <span class="frame">
                  @if (broken().has(offsets[ai] + pi)) {
                    <span class="placeholder">
                      <span class="ph-emoji">🖼️</span>
                      <span>missing<br />{{ fileName(photo.src) }}</span>
                    </span>
                  } @else {
                    <img
                      [src]="photo.src"
                      [alt]="photo.caption"
                      loading="lazy"
                      decoding="async"
                      (error)="markBroken(offsets[ai] + pi)"
                    />
                  }
                </span>
                <span class="caption">{{ photo.caption }}</span>
                <span class="tape" aria-hidden="true"></span>
              </button>
            }
          </div>
        </div>
      }
    </section>

    @if (openIndex() !== null) {
      <div
        class="lightbox"
        (click)="close()"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
      >
        <button type="button" class="lb-close" (click)="close()" aria-label="Close">✕</button>

        <figure class="lb-content" (click)="$event.stopPropagation()">
          @if (broken().has(openIndex()!)) {
            <div class="lb-placeholder">🖼️</div>
          } @else {
            <img
              [src]="current()!.src"
              [alt]="current()!.caption"
              (error)="markBroken(openIndex()!)"
            />
          }
          <figcaption>{{ current()!.caption }}</figcaption>
        </figure>

        <div class="lb-controls" (click)="$event.stopPropagation()">
          <button type="button" class="lb-nav" (click)="step(-1, $event)" aria-label="Previous">‹</button>
          <span class="lb-count">{{ openIndex()! + 1 }} / {{ total }}</span>
          <button type="button" class="lb-nav" (click)="step(1, $event)" aria-label="Next">›</button>
        </div>
      </div>
    }
  `,
  styles: `
    .album { margin-bottom: clamp(38px, 8vw, 76px); }
    .album:last-child { margin-bottom: 0; }

    .album-title {
      font-size: clamp(1.15rem, 4.4vw, 1.7rem);
      font-weight: 500;
      color: var(--lilac);
      text-align: center;
      text-wrap: balance;
    }

    .album-blurb {
      margin: 8px auto clamp(20px, 4.5vw, 34px);
      max-width: 40ch;
      text-align: center;
      font-family: var(--font-hand);
      font-size: clamp(1.1rem, 4.4vw, 1.45rem);
      font-weight: 500;
      color: var(--ink-soft);
      text-wrap: pretty;
    }

    /* Two-up scrapbook on a phone, roomier grid from tablet up. */
    .wall {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: clamp(14px, 4vw, 34px);
    }
    @media (min-width: 620px) {
      .wall { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
    }

    .polaroid {
      position: relative;
      display: grid;
      gap: clamp(8px, 2vw, 12px);
      padding: clamp(9px, 2.4vw, 14px);
      padding-bottom: clamp(12px, 3vw, 18px);
      min-width: 0;
      border: 0;
      cursor: pointer;
      font: inherit;
      text-align: center;
      /* Deliberately still a white polaroid — lit paper against the night. */
      background: var(--paper);
      border-radius: 8px;
      box-shadow: var(--shadow-soft);
      rotate: var(--tilt, 0deg);
      transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.35s ease, rotate 0.35s ease;
    }
    .polaroid:active { transform: scale(0.97); }
    .polaroid:focus-visible { outline: 3px solid var(--pink-strong); outline-offset: 4px; }

    /* Lift only where there's a real cursor — on iOS :hover sticks after a tap. */
    @media (hover: hover) and (pointer: fine) {
      .polaroid:hover {
        transform: translateY(-10px) scale(1.03);
        rotate: 0deg;
        box-shadow: var(--shadow-lift), 0 0 40px rgba(171, 154, 228, 0.3);
        z-index: 2;
      }
    }

    .frame {
      display: block;
      aspect-ratio: 4 / 5;
      border-radius: 4px;
      overflow: hidden;
      background: linear-gradient(150deg, #efe2ef, #ded2f2);
    }
    .frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .placeholder {
      height: 100%;
      display: grid;
      place-content: center;
      gap: 6px;
      padding: 10px;
      color: var(--on-light-soft);
      font-size: clamp(0.62rem, 2.4vw, 0.76rem);
      line-height: 1.5;
    }
    .ph-emoji { font-size: clamp(1.6rem, 6vw, 2.4rem); }

    /* Sits on the white polaroid, so it needs the on-light ink, not --ink. */
    .caption {
      font-family: var(--font-hand);
      font-size: clamp(0.95rem, 3.8vw, 1.25rem);
      font-weight: 600;
      color: var(--on-light);
      line-height: 1.25;
      overflow-wrap: break-word;
    }

    .tape {
      position: absolute;
      top: clamp(-9px, -2.4vw, -12px);
      left: 50%;
      translate: -50% 0;
      width: clamp(48px, 18vw, 78px);
      height: clamp(17px, 5vw, 26px);
      background: rgba(255, 195, 220, 0.5);
      border: 1px dashed rgba(255, 255, 255, 0.5);
      rotate: -3deg;
    }

    /* ── Lightbox ─────────────────────────────────────────────── */
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 150;
      display: grid;
      grid-template-rows: 1fr auto;
      justify-items: center;
      gap: clamp(12px, 3vw, 22px);
      padding:
        calc(clamp(52px, 12vw, 70px) + var(--safe-top))
        max(16px, var(--safe-right))
        calc(clamp(16px, 4vw, 30px) + var(--safe-bottom))
        max(16px, var(--safe-left));
      background: rgba(10, 5, 20, 0.86);
      -webkit-backdrop-filter: blur(14px);
      backdrop-filter: blur(14px);
      animation: fade 0.28s ease;
      /* Let horizontal swipes through to our handler, keep vertical for the OS. */
      touch-action: pan-y;
    }

    .lb-content {
      margin: 0;
      min-height: 0;
      display: grid;
      grid-template-rows: 1fr auto;
      gap: clamp(10px, 2.5vw, 14px);
      justify-items: center;
      align-content: center;
      animation: zoom 0.34s cubic-bezier(0.22, 1.2, 0.36, 1);
    }
    .lb-content img {
      max-width: 100%;
      max-height: 100%;
      min-height: 0;
      border-radius: var(--radius-sm);
      border: clamp(5px, 1.6vw, 8px) solid var(--paper);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6), 0 0 70px rgba(171, 154, 228, 0.2);
      object-fit: contain;
    }
    .lb-content figcaption {
      font-family: var(--font-hand);
      font-size: clamp(1.3rem, 5.6vw, 2rem);
      font-weight: 500;
      color: var(--ink);
      text-align: center;
      text-wrap: balance;
    }
    .lb-placeholder {
      display: grid;
      place-content: center;
      width: min(78vw, 380px);
      aspect-ratio: 4 / 5;
      font-size: 3.4rem;
      background: var(--paper);
      border-radius: var(--radius-sm);
    }

    .lb-controls {
      display: flex;
      align-items: center;
      gap: clamp(16px, 5vw, 26px);
    }

    .lb-count {
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: rgba(255, 255, 255, 0.85);
      font-variant-numeric: tabular-nums;
      min-width: 5ch;
      text-align: center;
    }

    .lb-close,
    .lb-nav {
      border: 0;
      cursor: pointer;
      color: var(--night);
      background: var(--pink);
      border-radius: 50%;
      display: grid;
      place-content: center;
      transition: transform 0.2s ease, background 0.2s ease;
    }
    .lb-close:active,
    .lb-nav:active { transform: scale(0.9); }
    @media (hover: hover) and (pointer: fine) {
      .lb-close:hover,
      .lb-nav:hover { transform: scale(1.12); background: #fff; }
    }
    @media (hover: none) {
      .lb-close, .lb-nav { box-shadow: var(--glow-pink); }
    }

    /* 44px minimum — Apple's touch target guidance. */
    .lb-nav {
      width: clamp(48px, 12vw, 56px);
      height: clamp(48px, 12vw, 56px);
      font-size: clamp(1.9rem, 6vw, 2.2rem);
      line-height: 1;
      padding-bottom: 6px;
    }

    .lb-close {
      position: absolute;
      top: calc(clamp(12px, 3vw, 26px) + var(--safe-top));
      right: calc(clamp(12px, 3vw, 26px) + var(--safe-right));
      width: 46px;
      height: 46px;
      font-size: 1.1rem;
    }

    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoom {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: none; }
    }
  `,
})
export class Gallery {
  protected readonly albums = BIRTHDAY.albums;

  /** Every photo in reading order — the lightbox walks this, not the albums. */
  private readonly flat = this.albums.flatMap((a) => a.photos);
  protected readonly total = this.flat.length;

  /** Index in `flat` where each album starts, so a tile knows its global spot. */
  protected readonly offsets = this.albums.reduce<number[]>((acc, album, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + this.albums[i - 1].photos.length);
    return acc;
  }, []);

  protected readonly openIndex = signal<number | null>(null);
  /** Indices whose image file 404'd, so we can show a friendly placeholder. */
  protected readonly broken = signal<ReadonlySet<number>>(new Set());

  private touchStartX = 0;
  private touchStartY = 0;

  protected readonly current = computed(() => {
    const i = this.openIndex();
    return i === null ? null : this.flat[i];
  });

  protected fileName(src: string): string {
    return src.split('/').pop() ?? src;
  }

  protected openAt(i: number): void {
    this.openIndex.set(i);
  }

  protected close(): void {
    this.openIndex.set(null);
  }

  protected step(delta: number, event: Event): void {
    event.stopPropagation();
    const i = this.openIndex();
    if (i === null) return;
    this.openIndex.set((i + delta + this.total) % this.total);
  }

  protected markBroken(i: number): void {
    this.broken.update((set) => new Set(set).add(i));
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
    this.touchStartY = event.changedTouches[0].clientY;
  }

  /** Swipe left/right to move between photos — the obvious gesture on a phone. */
  protected onTouchEnd(event: TouchEvent): void {
    const dx = event.changedTouches[0].clientX - this.touchStartX;
    const dy = event.changedTouches[0].clientY - this.touchStartY;

    // Ignore mostly-vertical drags so a scroll attempt doesn't flip the photo.
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    this.step(dx < 0 ? 1 : -1, event);
  }

  protected onKey(event: KeyboardEvent): void {
    if (this.openIndex() === null) return;
    if (event.key === 'Escape') this.close();
    if (event.key === 'ArrowRight') this.step(1, event);
    if (event.key === 'ArrowLeft') this.step(-1, event);
  }
}
