import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BIRTHDAY } from '../birthday.config';
import { RevealDirective } from '../shared/reveal.directive';

/** A sealed envelope that opens into a handwritten note. */
@Component({
  selector: 'app-letter',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" id="letter">
      <h2 class="section-title" appReveal>one last thing 💌</h2>
      <p class="section-sub" appReveal [revealDelay]="90">
        I wrote this bit properly. Open it when you're ready.
      </p>

      <div class="stage" appReveal [revealDelay]="150">
        @if (!open()) {
          <button type="button" class="envelope" (click)="open.set(true)">
            <span class="flap"></span>
            <span class="body">
              <span class="seal">💗</span>
            </span>
            <span class="label">for {{ name.toLowerCase() }}, with love</span>
          </button>
        } @else {
          <article class="note">
            <p class="salutation">{{ letter.salutation }}</p>
            @for (p of letter.paragraphs; track $index) {
              <p class="para">{{ p }}</p>
            }
            <p class="signoff">{{ letter.signoff }}</p>
            <p class="from">— {{ from }}</p>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .stage {
      display: grid;
      place-items: center;
      min-height: 320px;
    }

    /* ── Sealed state ──────────────────────────────────── */
    .envelope {
      position: relative;
      width: min(340px, 82vw);
      aspect-ratio: 3 / 2;
      border: 0;
      padding: 0;
      background: none;
      cursor: pointer;
      animation: float 3.4s ease-in-out infinite;
      transition: transform 0.3s ease;
    }
    .envelope:active { transform: scale(0.97); }
    @media (hover: hover) and (pointer: fine) {
      .envelope:hover { transform: scale(1.04); }
    }
    .envelope:focus-visible { outline: 3px dashed var(--rose); outline-offset: 14px; border-radius: 16px; }

    .body {
      position: absolute;
      inset: 0;
      border-radius: 10px;
      background: linear-gradient(160deg, #fae2ee, #f0bcd6);
      box-shadow: var(--shadow-lift), var(--glow-pink);
      display: grid;
      place-content: center;
    }
    .body::before,
    .body::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 52%;
      height: 100%;
      background: linear-gradient(160deg, #f4d5e6, #e8afcc);
    }
    .body::before { left: 0; clip-path: polygon(0 0, 0 100%, 100% 100%); }
    .body::after { right: 0; clip-path: polygon(100% 0, 0 100%, 100% 100%); }

    .flap {
      position: absolute;
      inset: 0 0 auto 0;
      height: 62%;
      background: linear-gradient(170deg, #f0b8d2, #dd8fb4);
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      border-radius: 10px 10px 0 0;
      z-index: 2;
    }

    .seal {
      position: relative;
      z-index: 3;
      display: grid;
      place-content: center;
      width: 56px;
      height: 56px;
      font-size: 1.6rem;
      border-radius: 50%;
      background: var(--paper);
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.5), var(--glow-pink);
      animation: beat 1.6s ease-in-out infinite;
    }

    .label {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -34px;
      font-family: var(--font-hand);
      font-size: clamp(1.15rem, 4.6vw, 1.4rem);
      font-weight: 500;
      color: var(--ink-soft);
    }

    /* ── Opened note ───────────────────────────────────── */
    .note {
      /* One rhythm shared by the ruled lines and the text sitting on them. */
      --rule: clamp(30px, 7vw, 38px);

      position: relative;
      width: min(640px, 100%);
      padding: clamp(26px, 7vw, 56px) clamp(20px, 6vw, 60px);
      background:
        repeating-linear-gradient(
          180deg,
          transparent 0 calc(var(--rule) - 1px),
          rgba(171, 154, 228, 0.16) calc(var(--rule) - 1px) var(--rule)
        ),
        linear-gradient(160deg, #fffdfa, #fdf1f6);
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-radius: var(--radius);
      /* Lit paper, held up in the dark. */
      box-shadow: var(--shadow-lift), 0 0 80px rgba(243, 210, 154, 0.16);
      animation: unfold 0.75s cubic-bezier(0.22, 1.1, 0.36, 1);
      transform-origin: top center;
    }
    .note::before {
      content: '🎀';
      position: absolute;
      top: -18px;
      left: 50%;
      translate: -50% 0;
      font-size: 2rem;
      filter: drop-shadow(0 4px 8px rgba(184, 85, 127, 0.3));
    }

    /* Text sits on the ruled lines instead of drifting across them. */
    .note p {
      font-family: var(--font-hand);
      font-size: clamp(1.15rem, 4.8vw, 1.6rem);
      font-weight: 500;
      line-height: var(--rule);
      color: var(--on-light);
      margin: 0 0 var(--rule);
      overflow-wrap: break-word;
      text-wrap: pretty;
    }

    .salutation { color: var(--rose-deep); font-weight: 600; }
    .para { text-indent: 6px; }

    .signoff {
      margin-bottom: 0 !important;
      color: var(--on-light-soft);
    }

    .from {
      margin: 0 !important;
      font-size: clamp(1.4rem, 6vw, 2rem) !important;
      color: var(--rose-deep);
      font-weight: 700;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    @keyframes beat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.12); }
    }
    @keyframes unfold {
      from { opacity: 0; transform: scaleY(0.2) translateY(-40px); }
      to { opacity: 1; transform: none; }
    }
  `,
})
export class Letter {
  protected readonly letter = BIRTHDAY.letter;
  protected readonly name = BIRTHDAY.name;
  protected readonly from = BIRTHDAY.from;
  protected readonly open = signal(false);
}
