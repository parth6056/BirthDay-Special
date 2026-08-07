import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { BIRTHDAY } from '../birthday.config';

/** Comfortable background level — it's underscoring the page, not the point. */
const TARGET_VOLUME = 0.55;

/** Floating play/pause pill. Hides itself if no track is configured or found. */
@Component({
  selector: 'app-music-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (music && available()) {
      <button
        type="button"
        class="pill"
        [class.playing]="playing()"
        (click)="toggle()"
        [attr.aria-label]="
          playing()
            ? 'Pause ' + music.title
            : 'Play ' + music.title + ' by ' + music.artist
        "
      >
        <span class="icon">{{ playing() ? '⏸' : '▶' }}</span>
        <span class="bars" aria-hidden="true">
          <i></i><i></i><i></i>
        </span>
        <span class="title">{{ music.title }}</span>
      </button>

      <audio
        #player
        [src]="music.src"
        loop
        preload="auto"
        (error)="available.set(false)"
      ></audio>
    }
  `,
  styles: `
    .pill {
      position: fixed;
      right: calc(clamp(14px, 3vw, 26px) + var(--safe-right));
      /* Clear of the iPhone home indicator. */
      bottom: calc(clamp(14px, 3vw, 26px) + var(--safe-bottom));
      z-index: 120;
      display: flex;
      align-items: center;
      gap: 10px;
      font: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      min-height: 46px;
      padding: 11px 20px 11px 16px;
      border: 1px solid rgba(237, 163, 189, 0.4);
      border-radius: 99px;
      color: var(--rose);
      background: var(--glass-strong);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      box-shadow: var(--shadow-soft), var(--glow-pink);
      cursor: pointer;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .pill:active { transform: scale(0.96); }
    @media (hover: hover) and (pointer: fine) {
      .pill:hover { transform: translateY(-3px); box-shadow: var(--shadow-lift); }
      .pill:hover .title { max-width: 130px; opacity: 1; }
    }

    .icon { font-size: 0.9rem; line-height: 1; }

    /* Collapsed to just the icon until it's playing, so it never covers content. */
    .title {
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      opacity: 0;
      transition: max-width 0.35s ease, opacity 0.35s ease;
    }
    .pill.playing .title {
      max-width: 130px;
      opacity: 1;
    }

    .bars {
      display: none;
      align-items: flex-end;
      gap: 2px;
      height: 14px;
    }
    .pill.playing .bars { display: flex; }
    .bars i {
      width: 3px;
      background: var(--pink-strong);
      border-radius: 2px;
      animation: eq 0.9s ease-in-out infinite;
    }
    .bars i:nth-child(2) { animation-delay: 0.15s; }
    .bars i:nth-child(3) { animation-delay: 0.3s; }

    @keyframes eq {
      0%, 100% { height: 4px; }
      50% { height: 14px; }
    }
  `,
})
export class MusicToggle implements OnDestroy {
  protected readonly music = BIRTHDAY.music;
  protected readonly available = signal(true);
  protected readonly playing = signal(false);

  private readonly player = viewChild<ElementRef<HTMLAudioElement>>('player');
  private fadeTimer?: ReturnType<typeof setInterval>;

  /**
   * Called the instant she taps the gift box.
   *
   * It has to run synchronously inside that tap: iOS only allows audio to
   * start from within a user gesture, and the gate's open animation would
   * otherwise put a timeout between the tap and this call.
   */
  async start(): Promise<void> {
    const el = this.player()?.nativeElement;
    if (!el || this.playing()) return;

    try {
      el.volume = 0;
      await el.play();
      this.playing.set(true);
      this.fadeIn(el);
    } catch {
      // Autoplay was refused. Leave the button up so she can start it herself.
    }
  }

  protected async toggle(): Promise<void> {
    const el = this.player()?.nativeElement;
    if (!el) return;

    if (this.playing()) {
      this.stopFade();
      el.pause();
      this.playing.set(false);
      return;
    }

    try {
      el.volume = 0;
      await el.play();
      this.playing.set(true);
      this.fadeIn(el, 900);
    } catch {
      // This one was a real tap, so a failure means the file is missing or
      // won't decode — drop the button rather than leave a dead control.
      this.available.set(false);
    }
  }

  /** Ramp up from silence so the song doesn't burst in at full volume. */
  private fadeIn(el: HTMLAudioElement, ms = 2600): void {
    this.stopFade();
    const steps = 30;
    let step = 0;

    this.fadeTimer = setInterval(() => {
      step++;
      el.volume = Math.min(TARGET_VOLUME, (step / steps) * TARGET_VOLUME);
      if (step >= steps) this.stopFade();
    }, ms / steps);
  }

  private stopFade(): void {
    if (this.fadeTimer) clearInterval(this.fadeTimer);
    this.fadeTimer = undefined;
  }

  ngOnDestroy(): void {
    this.stopFade();
  }
}
