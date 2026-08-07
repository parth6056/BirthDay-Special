import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BIRTHDAY } from '../birthday.config';
import { RevealDirective } from '../shared/reveal.directive';

/** Flip cards — front is the teaser, back is the actual sappy bit. */
@Component({
  selector: 'app-reasons',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" id="reasons">
      <h2 class="section-title" appReveal>reasons you're my favourite 💌</h2>
      <p class="section-sub" appReveal [revealDelay]="90">
        tap each one — there's something hiding underneath.
      </p>

      <div class="grid">
        @for (reason of reasons; track reason.front; let i = $index) {
          <button
            type="button"
            class="card-3d"
            appReveal
            [revealDelay]="i * 80"
            [class.flipped]="flipped().has(i)"
            [attr.aria-pressed]="flipped().has(i)"
            (click)="toggle(i)"
          >
            <span class="inner">
              <span class="face front">
                <span class="emoji">{{ reason.emoji }}</span>
                <span class="title">{{ reason.front }}</span>
                <span class="nudge">tap me</span>
              </span>
              <span class="face back">
                <span class="text">{{ reason.back }}</span>
              </span>
            </span>
          </button>
        }
      </div>
    </section>
  `,
  styles: `
    /*
     * Two-up on a phone. Full-width squares left each card mostly empty, since
     * the content is only ever a few short lines.
     */
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: clamp(12px, 3.5vw, 26px);
    }
    /* Three across on a wide screen, so six cards land as two clean rows. */
    @media (min-width: 620px) {
      .grid { grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); }
    }

    .card-3d {
      min-width: 0;
      border: 0;
      padding: 0;
      background: none;
      font: inherit;
      cursor: pointer;
      perspective: 1200px;
      aspect-ratio: 1 / 1;
    }
    .card-3d:focus-visible { outline: 3px solid var(--pink-strong); outline-offset: 6px; border-radius: var(--radius); }

    .inner {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
      transition: transform 0.7s cubic-bezier(0.4, 0.15, 0.2, 1);
    }
    .card-3d.flipped .inner { transform: rotateY(180deg); }

    /* iOS keeps :hover latched after a tap, so only lift on real pointers. */
    @media (hover: hover) and (pointer: fine) {
      .card-3d:hover .inner { transform: translateY(-6px); }
      .card-3d.flipped:hover .inner { transform: rotateY(180deg) translateY(-6px); }
    }
    .card-3d:active .inner { transform: scale(0.97); }
    .card-3d.flipped:active .inner { transform: rotateY(180deg) scale(0.97); }

    .face {
      position: absolute;
      inset: 0;
      display: grid;
      align-content: center;
      justify-items: center;
      gap: clamp(5px, 1.8vw, 10px);
      padding: clamp(10px, 3.2vw, 26px);
      text-align: center;
      border-radius: var(--radius);
      overflow: hidden;
      /* Safari needs the prefix or the back face bleeds through. */
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      box-shadow: var(--shadow-soft);
      border: 1px solid var(--line);
    }

    /* Front is a dark glass panel; flipping it reveals a lit one. */
    .front {
      background:
        linear-gradient(160deg, rgba(255, 255, 255, 0.09), rgba(171, 154, 228, 0.13));
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }
    .back {
      transform: rotateY(180deg);
      background: linear-gradient(160deg, #f0aecb, #8d78d6);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.25);
      box-shadow: var(--shadow-soft), var(--glow-pink);
    }

    /* Sized against the half-width phone card, not the viewport. */
    .emoji { font-size: clamp(1.6rem, 6.4vw, 3rem); line-height: 1; }

    .title {
      font-family: var(--font-display);
      font-size: clamp(0.85rem, 3.4vw, 1.25rem);
      font-weight: 500;
      letter-spacing: -0.02em;
      color: var(--gold);
      line-height: 1.25;
      text-wrap: balance;
    }

    .nudge {
      font-size: clamp(0.52rem, 2vw, 0.64rem);
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--ink-soft);
      opacity: 0.6;
    }

    /* Sized down from the Caveat value — Dancing Script sets noticeably wider,
       and the longest reason has to fit a half-width card without clipping. */
    .text {
      font-family: var(--font-hand);
      font-size: clamp(0.88rem, 3.5vw, 1.45rem);
      font-weight: 500;
      line-height: 1.35;
      overflow-wrap: break-word;
      text-wrap: pretty;
      text-shadow: 0 2px 10px rgba(60, 20, 60, 0.4);
    }
  `,
})
export class Reasons {
  protected readonly reasons = BIRTHDAY.reasons;
  protected readonly flipped = signal<ReadonlySet<number>>(new Set());

  protected toggle(i: number): void {
    this.flipped.update((set) => {
      const next = new Set(set);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }
}
