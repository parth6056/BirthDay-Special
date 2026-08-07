import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from '@angular/core';
import { BIRTHDAY } from '../birthday.config';
import { burstConfetti } from '../shared/confetti';

const CANDLES = [0, 1, 2, 3, 4];

@Component({
  selector: 'app-cake',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section cake-section" id="cake">
      <h2 class="section-title">make a wish 🎂</h2>
      <p class="section-sub">
        @if (!blownOut()) {
          tap the candles — or hit the mic button and actually blow at your screen.
        } @else {
          I hope every single one of them comes true.
        }
      </p>

      <div class="stage">
        <button
          type="button"
          class="cake"
          (click)="blowOut()"
          [attr.aria-label]="blownOut() ? 'Candles are out' : 'Blow out the candles'"
        >
          <span class="candles">
            @for (c of candles; track c) {
              <span class="candle">
                <span class="flame" [class.out]="blownOut()" [style.animation-delay.ms]="c * 140"></span>
                <span class="smoke" [class.show]="blownOut()" [style.animation-delay.ms]="c * 90"></span>
                <span class="wick"></span>
                <span class="stick"></span>
              </span>
            }
          </span>

          <span class="tier top">
            <span class="drip"></span>
            <span class="sprinkles"></span>
          </span>
          <span class="tier bottom">
            <span class="drip"></span>
            <span class="sprinkles"></span>
          </span>
          <span class="plate"></span>
        </button>
      </div>

      @if (!blownOut()) {
        <div class="mic-row">
          <button type="button" class="mic-btn" (click)="listenForBlow()" [disabled]="listening()">
            {{ listening() ? '🎤 blow at your screen…' : '🎤 let me blow them out for real' }}
          </button>
          @if (micError()) {
            <p class="mic-note">{{ micError() }}</p>
          }
        </div>
      } @else {
        <p class="wish">happy birthday, {{ name }} 🩷</p>
      }
    </section>
  `,
  styles: `
    .cake-section { text-align: center; }

    .stage {
      display: grid;
      place-items: center;
      margin-bottom: clamp(18px, 4vw, 26px);
    }

    /*
     * The cake is a fixed-ratio box and every part inside is a percentage of
     * it, so it scales down to a 320px iPhone without any piece drifting.
     */
    .cake {
      position: relative;
      width: min(300px, 76vw);
      aspect-ratio: 1 / 1;
      border: 0;
      background: none;
      padding: 0;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .cake:active { transform: scale(0.97); }
    @media (hover: hover) and (pointer: fine) {
      .cake:hover { transform: translateY(-6px) scale(1.02); }
    }
    .cake:focus-visible { outline: 3px dashed var(--rose); outline-offset: 14px; border-radius: 20px; }

    /* ── Tiers ─────────────────────────────────────────── */
    .tier {
      position: absolute;
      left: 50%;
      translate: -50% 0;
      border-radius: 10px 10px 8px 8px;
      box-shadow: inset 0 -14px 26px rgba(0, 0, 0, 0.09), var(--shadow-soft);
    }
    .top {
      bottom: 40%;
      width: 62%;
      height: 24.7%;
      background: linear-gradient(170deg, #f7dcea, #eeb6d0);
    }
    .bottom {
      bottom: 15.3%;
      width: 92%;
      height: 29.3%;
      background: linear-gradient(170deg, #f9d9bd, #eab894);
    }

    /* Scalloped icing drip, tiled so it scales with the tier. */
    .drip {
      position: absolute;
      inset: 0 0 auto 0;
      height: 33%;
      border-radius: 10px 10px 0 0;
      background:
        radial-gradient(circle at 50% 92%, #fff6fa 0 48%, transparent 49%)
          0 0 / 22% 150% repeat-x,
        #fffdfe;
    }

    .sprinkles {
      position: absolute;
      inset: 40% 6% 8%;
      background-image:
        radial-gradient(circle, #e896b6 1.6px, transparent 2px),
        radial-gradient(circle, #ab9ae4 1.6px, transparent 2px),
        radial-gradient(circle, #7de3c0 1.6px, transparent 2px);
      background-size: 34px 26px, 41px 31px, 47px 23px;
      background-position: 0 0, 12px 9px, 22px 4px;
      opacity: 0.85;
      border-radius: 0 0 8px 8px;
    }

    .plate {
      position: absolute;
      left: 50%;
      bottom: 9.3%;
      translate: -50% 0;
      width: 108%;
      height: 6.7%;
      border-radius: 50%;
      background: linear-gradient(180deg, #f6ecf4, #d8c4d8);
      box-shadow: 0 16px 34px rgba(0, 0, 0, 0.55);
    }

    /* ── Candles ───────────────────────────────────────── */
    .candles {
      position: absolute;
      left: 50%;
      bottom: 64.7%;
      translate: -50% 0;
      display: flex;
      gap: clamp(9px, 3.4vw, 18px);
    }

    .candle {
      position: relative;
      width: clamp(8px, 2.6vw, 10px);
      height: clamp(37px, 12vw, 46px);
    }

    .stick {
      position: absolute;
      inset: auto 0 0 0;
      height: 87%;
      border-radius: 4px;
      background: repeating-linear-gradient(
        45deg, #fff 0 5px, #f0aecb 5px 10px
      );
      box-shadow: inset -2px 0 3px rgba(0, 0, 0, 0.1);
    }

    .wick {
      position: absolute;
      left: 50%;
      top: 9%;
      translate: -50% 0;
      width: 2px;
      height: 13%;
      background: #6b4a3a;
      border-radius: 2px;
    }

    .flame {
      position: absolute;
      left: 50%;
      top: -35%;
      translate: -50% 0;
      width: 120%;
      height: 44%;
      border-radius: 50% 50% 46% 46% / 62% 62% 38% 38%;
      background: radial-gradient(circle at 50% 72%, #fff9d6 0%, #ffc25c 45%, #ff7a2f 78%, rgba(255,122,47,0) 100%);
      /* A candle in the dark should actually throw light. */
      box-shadow: 0 0 30px 11px rgba(255, 181, 71, 0.7),
                  0 0 70px 26px rgba(255, 150, 60, 0.25);
      transform-origin: 50% 100%;
      animation: flicker 0.42s ease-in-out infinite alternate;
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .flame.out {
      opacity: 0;
      transform: translate(-50%, 6px) scaleY(0.2);
      animation: none;
    }

    .smoke {
      position: absolute;
      left: 50%;
      top: -30%;
      translate: -50% 0;
      width: 80%;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      background: rgba(180, 170, 180, 0.55);
      opacity: 0;
    }
    .smoke.show { animation: puff 2.4s ease-out forwards; }

    @keyframes flicker {
      from { transform: translateX(-50%) scale(1) rotate(-3deg); }
      to { transform: translateX(-50%) scale(1.14, 0.92) rotate(3deg); }
    }
    @keyframes puff {
      0% { opacity: 0.7; transform: translate(-50%, 0) scale(0.5); }
      100% { opacity: 0; transform: translate(-50%, -70px) scale(2.6); }
    }

    /* ── Controls ──────────────────────────────────────── */
    .mic-btn {
      font: inherit;
      font-weight: 600;
      font-size: clamp(0.88rem, 3.6vw, 1rem);
      max-width: 100%;
      /* Comfortably past the 44px Apple touch-target minimum. */
      min-height: 48px;
      padding: 12px clamp(18px, 5vw, 26px);
      border-radius: 99px;
      border: 1px solid rgba(237, 163, 189, 0.4);
      color: var(--rose);
      background: var(--glass-strong);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow-soft), var(--glow-pink);
      cursor: pointer;
      text-wrap: balance;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .mic-btn:active:not(:disabled) { transform: scale(0.96); }
    @media (hover: hover) and (pointer: fine) {
      .mic-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: var(--shadow-lift); }
    }
    .mic-btn:disabled { cursor: default; animation: pulse 1.3s ease-in-out infinite; }

    .mic-note {
      margin: 12px auto 0;
      max-width: 32ch;
      font-size: clamp(0.8rem, 3.2vw, 0.85rem);
      line-height: 1.6;
      color: var(--ink-soft);
      text-wrap: pretty;
    }

    .wish {
      margin: 0;
      font-family: var(--font-hand);
      font-size: clamp(1.8rem, 8.4vw, 3rem);
      font-weight: 600;
      color: var(--gold);
      text-shadow: 0 0 34px rgba(243, 210, 154, 0.45);
      text-wrap: balance;
      animation: zoomIn 0.6s cubic-bezier(0.22, 1.4, 0.36, 1);
    }

    @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.7); }
      to { opacity: 1; transform: none; }
    }
  `,
})
export class Cake implements OnDestroy {
  protected readonly candles = CANDLES;
  protected readonly name = BIRTHDAY.name;

  protected readonly blownOut = signal(false);
  protected readonly listening = signal(false);
  protected readonly micError = signal<string | null>(null);

  private stream?: MediaStream;
  private audioCtx?: AudioContext;
  private rafId?: number;

  protected blowOut(): void {
    if (this.blownOut()) return;
    this.blownOut.set(true);
    this.stopListening();
    burstConfetti(0.5, 0.5, 180);
    setTimeout(() => burstConfetti(0.2, 0.35, 70), 260);
    setTimeout(() => burstConfetti(0.8, 0.35, 70), 420);
  }

  /** Opt-in: watch the mic level and puff the candles out on a real breath. */
  protected async listenForBlow(): Promise<void> {
    this.micError.set(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      this.micError.set("your browser won't let me use the mic — just tap the cake instead 💕");
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      this.micError.set('no mic access — tapping the cake works just as well 🩷');
      return;
    }

    this.listening.set(true);
    this.audioCtx = new AudioContext();
    const source = this.audioCtx.createMediaStreamSource(this.stream);
    const analyser = this.audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    let loudFrames = 0;

    const check = (): void => {
      if (this.blownOut()) return;
      analyser.getByteTimeDomainData(data);

      // Rough loudness: RMS deviation from the 128 silence midpoint.
      let sum = 0;
      for (const v of data) {
        const d = (v - 128) / 128;
        sum += d * d;
      }
      const rms = Math.sqrt(sum / data.length);

      // A sustained blow reads much louder than room noise.
      loudFrames = rms > 0.16 ? loudFrames + 1 : 0;
      if (loudFrames > 6) {
        this.blowOut();
        return;
      }
      this.rafId = requestAnimationFrame(check);
    };
    this.rafId = requestAnimationFrame(check);
  }

  private stopListening(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.stream?.getTracks().forEach((t) => t.stop());
    void this.audioCtx?.close();
    this.stream = undefined;
    this.audioCtx = undefined;
    this.listening.set(false);
  }

  ngOnDestroy(): void {
    this.stopListening();
  }
}
