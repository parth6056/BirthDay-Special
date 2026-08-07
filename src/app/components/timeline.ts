import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BIRTHDAY } from '../birthday.config';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-timeline',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" id="timeline">
      <h2 class="section-title" appReveal>the story so far 🌷</h2>
      <p class="section-sub" appReveal [revealDelay]="90">
        a very short highlight reel of my favourite ongoing project: us.
      </p>

      <ol class="line">
        @for (moment of moments; track moment.title; let i = $index) {
          <li class="moment" appReveal [revealDelay]="i * 110">
            <span class="dot" aria-hidden="true">{{ moment.emoji }}</span>
            <div class="bubble card">
              <p class="when">{{ moment.date }}</p>
              <h3 class="what">{{ moment.title }}</h3>
              <p class="why">{{ moment.text }}</p>
            </div>
          </li>
        }
      </ol>
    </section>
  `,
  styles: `
    /* One shared measurement so the rail, the dots and the text all agree. */
    .line {
      --gutter: clamp(46px, 9vw, 70px);
      --dot: clamp(38px, 8.6vw, 54px);

      position: relative;
      list-style: none;
      margin: 0;
      padding: 0 0 0 var(--gutter);
      display: grid;
      gap: clamp(18px, 4vw, 38px);
    }
    .line::before {
      content: '';
      position: absolute;
      left: calc(var(--gutter) / 2 - 2px);
      top: 8px;
      bottom: 8px;
      width: 4px;
      border-radius: 99px;
      background: linear-gradient(180deg, var(--pink), var(--lilac));
      opacity: 0.55;
      box-shadow: 0 0 18px rgba(171, 154, 228, 0.4);
    }

    .moment { position: relative; }

    .dot {
      position: absolute;
      /* Centre the dot on the rail rather than guessing an offset. */
      left: calc(-1 * var(--gutter) / 2 - var(--dot) / 2);
      top: 6px;
      width: var(--dot);
      height: var(--dot);
      display: grid;
      place-content: center;
      font-size: clamp(1rem, 4.2vw, 1.5rem);
      background: var(--night-2);
      border: 2px solid rgba(171, 154, 228, 0.45);
      border-radius: 50%;
      box-shadow: var(--shadow-soft), 0 0 22px rgba(171, 154, 228, 0.3);
    }

    .bubble {
      padding: clamp(16px, 4vw, 26px) clamp(16px, 4.4vw, 30px);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    @media (hover: hover) and (pointer: fine) {
      .bubble:hover {
        transform: translateX(6px);
        box-shadow: var(--shadow-lift);
      }
    }

    .when {
      margin: 0 0 8px;
      font-size: clamp(0.62rem, 2.4vw, 0.72rem);
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--lilac);
    }

    .what {
      font-size: clamp(1.05rem, 4.2vw, 1.45rem);
      font-weight: 500;
      color: var(--gold);
      margin-bottom: 10px;
      line-height: 1.3;
      text-wrap: balance;
    }

    .why {
      margin: 0;
      line-height: 1.75;
      color: var(--ink-soft);
      font-size: clamp(0.88rem, 3.5vw, 1rem);
      text-wrap: pretty;
    }
  `,
})
export class Timeline {
  protected readonly moments = BIRTHDAY.timeline;
}
