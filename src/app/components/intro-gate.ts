import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { BIRTHDAY } from '../birthday.config';
import { burstConfetti } from '../shared/confetti';

/** Full-screen "tap to open your present" curtain shown before the site. */
@Component({
  selector: 'app-intro-gate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gate" [class.leaving]="opening()">
      <p class="pre">psst… there's something here for you</p>

      <button
        type="button"
        class="gift"
        [class.pop]="opening()"
        (click)="open()"
        [attr.aria-label]="'Open your birthday surprise, ' + name"
      >
        <span class="lid">
          <span class="bow">🎀</span>
        </span>
        <span class="box">
          <span class="ribbon"></span>
        </span>
      </button>

      <p class="hint">tap the box, {{ name.toLowerCase() }} 💕</p>
    </div>
  `,
  styles: `
    .gate {
      position: fixed;
      inset: 0;
      z-index: 200;
      display: grid;
      place-content: center;
      justify-items: center;
      gap: clamp(18px, 5vw, 26px);
      padding:
        calc(24px + var(--safe-top))
        max(24px, var(--safe-right))
        calc(24px + var(--safe-bottom))
        max(24px, var(--safe-left));
      text-align: center;
      background:
        radial-gradient(760px 620px at 50% 42%, rgba(120, 60, 140, 0.5) 0%, transparent 70%),
        linear-gradient(165deg, #1b0f33, #2a1a4d 55%, #120b22);
      /* Swallow scroll gestures rather than letting them reach the page. */
      touch-action: none;
      transition: opacity 0.7s ease, visibility 0.7s;
    }
    .gate.leaving {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .pre {
      margin: 0;
      max-width: 20ch;
      font-family: var(--font-hand);
      font-size: clamp(1.4rem, 6.2vw, 2.1rem);
      font-weight: 500;
      line-height: 1.35;
      color: var(--ink-soft);
      text-wrap: balance;
    }

    .hint {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--gold);
      text-shadow: 0 0 22px rgba(243, 210, 154, 0.45);
      animation: pulse 1.9s ease-in-out infinite;
    }

    .gift {
      position: relative;
      width: clamp(150px, 48vw, 210px);
      aspect-ratio: 1 / 1;
      border: 0;
      background: none;
      padding: 0;
      cursor: pointer;
      animation: bob 2.6s ease-in-out infinite;
      transition: transform 0.25s ease;
    }
    .gift:active { transform: scale(0.96); }
    @media (hover: hover) and (pointer: fine) {
      .gift:hover { transform: scale(1.06); }
    }
    .gift:focus-visible { outline: 3px dashed var(--rose); outline-offset: 12px; border-radius: 20px; }

    .box {
      position: absolute;
      left: 8%;
      bottom: 0;
      width: 84%;
      height: 64%;
      border-radius: 12px 12px 20px 20px;
      background: linear-gradient(160deg, #f0aecb, #cf6d95);
      box-shadow: var(--shadow-lift), var(--glow-pink),
                  inset 0 -10px 20px rgba(0, 0, 0, 0.16);
    }
    .ribbon {
      position: absolute;
      left: 50%;
      top: 0;
      width: 18%;
      height: 100%;
      transform: translateX(-50%);
      background: linear-gradient(180deg, #fdf0d8, #f3d8a4);
    }

    .lid {
      position: absolute;
      left: 0;
      top: 16%;
      width: 100%;
      height: 26%;
      border-radius: 12px;
      background: linear-gradient(160deg, #f8cfe0, #e396ba);
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.45);
      transform-origin: 10% 100%;
      transition: transform 0.55s cubic-bezier(0.6, -0.4, 0.4, 1.6);
    }
    .bow {
      position: absolute;
      left: 50%;
      top: -46%;
      transform: translateX(-50%);
      font-size: clamp(2.6rem, 8vw, 3.6rem);
      filter: drop-shadow(0 6px 16px rgba(237, 163, 189, 0.55));
    }

    /* The opening moment */
    .gift.pop { animation: shake 0.42s ease-in-out; }
    .gift.pop .lid { transform: translate(-46%, -170%) rotate(-38deg); }
    .gift.pop .box { transform: scale(1.04); }

    @keyframes bob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-14px); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0) rotate(0); }
      25% { transform: translateX(-8px) rotate(-4deg); }
      75% { transform: translateX(8px) rotate(4deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.55; }
      50% { opacity: 1; }
    }
  `,
})
export class IntroGate {
  /**
   * Fires synchronously on the tap, before the open animation runs. Anything
   * needing the user-gesture context — starting audio on iOS — must hang off
   * this rather than `opened`.
   */
  readonly tapped = output<void>();

  /** Emitted once the box has popped and the curtain is on its way out. */
  readonly opened = output<void>();

  protected readonly name = BIRTHDAY.name;
  protected readonly opening = signal(false);

  protected open(): void {
    if (this.opening()) return;
    this.opening.set(true);
    this.tapped.emit();
    burstConfetti(0.5, 0.45, 170);
    setTimeout(() => this.opened.emit(), 620);
  }
}
