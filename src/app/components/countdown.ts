import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  signal,
} from '@angular/core';
import { BIRTHDAY } from '../birthday.config';
import { nextBirthday, phaseFor, turningAge } from '../shared/birthday-dates';

@Component({
  selector: 'app-countdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (phase()) {
      @case ('today') {
        <div class="wrap">
          <p class="today">it's officially your day 🎉</p>
        </div>
      }
      @case ('just-after') {
        <div class="wrap">
          <p class="today">hope it was the softest, sweetest day 🎂</p>
        </div>
      }
      @default {
        <div class="wrap">
          <p class="label">
            @if (isSoon()) {
              almost there — only
            } @else {
              turning {{ age() }} in…
            }
          </p>
          <div class="units">
            @for (u of units(); track u.label) {
              <div class="unit">
                <span class="value">{{ u.value }}</span>
                <span class="name">{{ u.label }}</span>
              </div>
            }
          </div>
        </div>
      }
    }
  `,
  styles: `
    .wrap { text-align: center; }

    .label {
      margin: 0 0 16px;
      font-family: var(--font-hand);
      font-size: clamp(1.3rem, 4.4vw, 1.8rem);
      font-weight: 500;
      color: var(--ink-soft);
    }

    .today {
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(1.2rem, 4.4vw, 1.9rem);
      font-weight: 500;
      color: var(--gold);
      text-shadow: 0 0 30px rgba(243, 210, 154, 0.35);
    }

    .units {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: clamp(8px, 2.4vw, 16px);
    }

    .unit {
      display: grid;
      gap: 4px;
      min-width: clamp(66px, 17vw, 96px);
      padding: clamp(12px, 2.6vw, 18px) clamp(8px, 2vw, 14px);
      border-radius: var(--radius-sm);
      background: var(--glass);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid var(--line);
      box-shadow: var(--shadow-soft);
    }

    .value {
      font-family: var(--font-display);
      font-size: clamp(1.55rem, 5.2vw, 2.4rem);
      font-weight: 500;
      line-height: 1;
      letter-spacing: -0.02em;
      color: var(--gold);
      font-variant-numeric: tabular-nums;
      text-shadow: 0 0 24px rgba(243, 210, 154, 0.35);
    }

    .name {
      font-size: clamp(0.6rem, 2.2vw, 0.7rem);
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--ink-soft);
    }
  `,
})
export class Countdown implements OnDestroy {
  private readonly now = signal(new Date());
  private readonly timer = setInterval(() => this.now.set(new Date()), 1000);

  private readonly target = computed(() =>
    nextBirthday(BIRTHDAY.birthDate, this.now()),
  );

  protected readonly phase = computed(() => phaseFor(BIRTHDAY.birthDate, this.now()));
  protected readonly age = computed(() => turningAge(BIRTHDAY.birthDate, this.now()));

  /** Under a week out — worth a warmer line than the plain label. */
  protected readonly isSoon = computed(
    () => this.target().getTime() - this.now().getTime() < 7 * 86_400_000,
  );

  protected readonly units = computed(() => {
    const diff = Math.max(0, this.target().getTime() - this.now().getTime());
    const secs = Math.floor(diff / 1000);
    return [
      { label: 'days', value: pad(Math.floor(secs / 86400)) },
      { label: 'hours', value: pad(Math.floor(secs / 3600) % 24) },
      { label: 'minutes', value: pad(Math.floor(secs / 60) % 60) },
      { label: 'seconds', value: pad(secs % 60) },
    ];
  });

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
