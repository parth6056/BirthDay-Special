import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BIRTHDAY } from '../birthday.config';
import { phaseFor, turningAge } from '../shared/birthday-dates';
import { burstConfetti } from '../shared/confetti';
import { Countdown } from './countdown';

@Component({
  selector: 'app-hero',
  imports: [Countdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hero">
      <p class="greeting">{{ hero.greeting }}</p>

      @if (!coverBroken()) {
        <div class="cover">
          <img
            [src]="cover.src"
            [alt]="cover.alt"
            fetchpriority="high"
            decoding="async"
            (error)="coverBroken.set(true)"
          />
          <span class="cover-tape" aria-hidden="true"></span>
        </div>
      }

      <h1 class="name" (click)="celebrate($event)" title="tap me ✨">
        @for (ch of letters; track $index) {
          <span class="letter" [style.animation-delay.ms]="$index * 65">{{ ch }}</span>
        }
      </h1>

      @if (showAge) {
        <p class="age">
          @if (isBirthday) {
            {{ age }} whole trips around the sun ☀️
          } @else {
            {{ age }} looks so good on you ☀️
          }
        </p>
      }

      <p class="tagline">{{ hero.tagline }}</p>

      <app-countdown />

      <div class="scroll-cue" aria-hidden="true">
        <span>scroll, there's more</span>
        <span class="arrow">︾</span>
      </div>
    </header>
  `,
  styles: `
    .hero {
      position: relative;
      z-index: 1;
      /* svh = the *small* viewport height, so iOS Safari's collapsing address
         bar can't leave a gap or push the scroll cue off-screen. */
      min-height: 100vh;
      min-height: 100svh;
      display: grid;
      align-content: center;
      justify-items: center;
      gap: clamp(12px, 2.4vw, 22px);
      text-align: center;
      padding-top: calc(clamp(60px, 12vw, 80px) + var(--safe-top));
      padding-bottom: calc(clamp(44px, 8vw, 60px) + var(--safe-bottom));
      padding-inline: max(18px, var(--safe-left)) max(18px, var(--safe-right));
      max-width: 900px;
      margin: 0 auto;
    }

    .greeting {
      margin: 0;
      max-width: 22ch;
      font-family: var(--font-hand);
      font-size: clamp(1.3rem, 5.8vw, 2.2rem);
      font-weight: 500;
      line-height: 1.3;
      color: var(--lilac);
      transform: rotate(-2deg);
      text-wrap: balance;
    }

    /* Capped in svh so it can never crowd the name off a short phone screen. */
    .cover {
      position: relative;
      width: min(300px, 62vw);
      max-height: 38svh;
      aspect-ratio: 4 / 5;
      padding: clamp(8px, 2.2vw, 12px);
      /* Stays a white polaroid — a lit photo against the night is the point. */
      background: var(--paper);
      border-radius: 10px;
      box-shadow: var(--shadow-lift), 0 0 60px rgba(171, 154, 228, 0.25);
      rotate: -2.5deg;
      animation: driftIn 1s cubic-bezier(0.22, 1.2, 0.36, 1) backwards,
                 hover 5s ease-in-out 1s infinite;
    }
    .cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      border-radius: 5px;
    }
    .cover-tape {
      position: absolute;
      top: -11px;
      left: 50%;
      translate: -50% 0;
      width: 84px;
      height: 26px;
      background: rgba(255, 195, 220, 0.55);
      border: 1px dashed rgba(255, 255, 255, 0.5);
      rotate: 3deg;
    }

    .name {
      margin: 0;
      font-size: clamp(2.7rem, 15vw, 7rem);
      line-height: 1.08;
      font-weight: 600;
      /* Lexend Deca sets wide — pull the display size in a little. */
      letter-spacing: -0.03em;
      cursor: pointer;
      user-select: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .letter {
      display: inline-block;
      /* Starlight: champagne through blush into lilac. Kept bright all the way
         through — a dark backdrop turns any dark stop to mud. */
      background: linear-gradient(165deg, #fbeacb 0%, #f3c5d6 45%, #b3a4e8 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: drop 0.9s cubic-bezier(0.22, 1.4, 0.36, 1) backwards,
                 sway 4.5s ease-in-out infinite;
      filter: drop-shadow(0 0 34px rgba(243, 210, 154, 0.4));
    }
    .letter:nth-child(even) { animation-delay: 0s, 0.4s; }

    .age {
      margin: 0;
      font-family: var(--font-body);
      font-size: clamp(0.86rem, 3.4vw, 1.15rem);
      font-weight: 500;
      letter-spacing: 0.04em;
      color: var(--gold);
      background: rgba(243, 210, 154, 0.09);
      border: 1px solid rgba(243, 210, 154, 0.28);
      padding: 8px clamp(14px, 4vw, 20px);
      border-radius: 99px;
      box-shadow: var(--glow-gold);
      transform: rotate(1.5deg);
      text-wrap: nowrap;
    }

    .tagline {
      margin: 0 0 clamp(10px, 3vw, 26px);
      max-width: 34ch;
      font-size: clamp(0.95rem, 3.9vw, 1.2rem);
      line-height: 1.65;
      color: var(--ink-soft);
      text-wrap: pretty;
    }

    .scroll-cue {
      margin-top: clamp(20px, 5vw, 44px);
      display: grid;
      gap: 4px;
      justify-items: center;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: lowercase;
      color: var(--ink-soft);
      opacity: 0.75;
    }
    .arrow {
      font-size: 1.3rem;
      color: var(--pink-strong);
      animation: nudge 1.8s ease-in-out infinite;
    }

    @keyframes drop {
      from { opacity: 0; transform: translateY(-70px) rotate(-14deg) scale(0.6); }
      to { opacity: 1; transform: none; }
    }
    @keyframes driftIn {
      from { opacity: 0; transform: translateY(26px) scale(0.9); }
      to { opacity: 1; transform: none; }
    }
    @keyframes hover {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes sway {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-9px) rotate(2deg); }
    }
    @keyframes nudge {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(8px); }
    }
  `,
})
export class Hero {
  protected readonly hero = BIRTHDAY.hero;
  protected readonly cover = BIRTHDAY.cover;
  protected readonly showAge = BIRTHDAY.showAge;
  /** Drop the frame entirely rather than show a broken image. */
  protected readonly coverBroken = signal(false);
  /** Split so each letter can animate in on its own. */
  protected readonly letters = [...BIRTHDAY.name];

  private readonly today = new Date();
  protected readonly age = turningAge(BIRTHDAY.birthDate, this.today);
  protected readonly isBirthday = phaseFor(BIRTHDAY.birthDate, this.today) === 'today';

  protected celebrate(event: MouseEvent): void {
    burstConfetti(
      event.clientX / window.innerWidth,
      event.clientY / window.innerHeight,
      110,
    );
  }
}
