import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  signal,
  viewChild,
} from '@angular/core';
import { BIRTHDAY } from './birthday.config';
import { Cake } from './components/cake';
import { FloatingHearts } from './components/floating-hearts';
import { Gallery } from './components/gallery';
import { Hero } from './components/hero';
import { IntroGate } from './components/intro-gate';
import { Letter } from './components/letter';
import { MusicToggle } from './components/music-toggle';
import { Reasons } from './components/reasons';
import { Timeline } from './components/timeline';

@Component({
  selector: 'app-root',
  imports: [
    FloatingHearts,
    IntroGate,
    Hero,
    Gallery,
    Reasons,
    Timeline,
    Cake,
    Letter,
    MusicToggle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly footer = BIRTHDAY.footer;
  protected readonly from = BIRTHDAY.from;
  protected readonly name = BIRTHDAY.name;

  /** The gift-box curtain stays up until she taps it. */
  protected readonly entered = signal(false);

  private readonly musicToggle = viewChild(MusicToggle);

  /** Kicks the song off from inside the tap, while the gesture still counts. */
  protected startMusic(): void {
    void this.musicToggle()?.start();
  }

  constructor() {
    // Freeze the page behind the curtain so there's nothing to scroll past.
    afterNextRender(() => {
      if (!this.entered()) document.body.classList.add('locked');
    });
  }

  protected enter(): void {
    this.entered.set(true);
    document.body.classList.remove('locked');
    window.scrollTo({ top: 0 });
  }
}
