import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Floater {
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

const EMOJIS = ['🎀', '💗', '🌸', '✨', '🧁', '💕', '🩷', '⭐', '🫧', '🍓'];

/** Slow-drifting cuteness that sits behind the whole page. */
@Component({
  selector: 'app-floating-hearts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sky" aria-hidden="true">
      @for (f of floaters; track $index) {
        <span
          class="floater"
          [style.left.%]="f.left"
          [style.font-size.px]="f.size"
          [style.animation-duration.s]="f.duration"
          [style.animation-delay.s]="-f.delay"
          [style.--drift.px]="f.drift"
          >{{ f.emoji }}</span
        >
      }
    </div>
  `,
  styles: `
    .sky {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }

    .floater {
      position: absolute;
      bottom: -12vh;
      opacity: 0;
      will-change: transform, opacity;
      animation-name: rise;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      filter: drop-shadow(0 4px 10px rgba(184, 85, 127, 0.18));
    }

    /* drop-shadow on every floater is a real cost on a phone GPU. */
    @media (max-width: 700px) {
      .floater { filter: none; }
    }

    @keyframes rise {
      0% {
        transform: translate3d(0, 0, 0) rotate(0deg) scale(0.85);
        opacity: 0;
      }
      /* Faint on purpose — they pass behind body text and must not fight it. */
      12% { opacity: 0.42; }
      88% { opacity: 0.3; }
      100% {
        transform: translate3d(var(--drift), -118vh, 0) rotate(320deg) scale(1.05);
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .sky { display: none; }
    }
  `,
})
export class FloatingHearts {
  /** Fewer on a phone — narrower screen, and less work for a mobile GPU. */
  private readonly count =
    typeof window !== 'undefined' && window.innerWidth < 700 ? 12 : 22;

  protected readonly floaters: Floater[] = Array.from({ length: this.count }, () => ({
    emoji: EMOJIS[(Math.random() * EMOJIS.length) | 0],
    // Kept off the edges so nothing drifts out and gets sliced in half.
    left: 5 + Math.random() * 86,
    size: 16 + Math.random() * 24,
    duration: 16 + Math.random() * 18,
    delay: Math.random() * 34,
    drift: (Math.random() - 0.5) * 160,
  }));
}
