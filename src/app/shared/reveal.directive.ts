import {
  Directive,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

/**
 * Adds `.is-visible` the first time the host scrolls into view, which drives
 * the `.reveal` fade-up defined in styles.css.
 *
 *   <div appReveal [revealDelay]="120">…</div>
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class RevealDirective implements OnDestroy {
  /** Stagger in milliseconds, handy inside @for loops. */
  readonly revealDelay = input(0);

  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement as HTMLElement;
      el.style.transitionDelay = `${this.revealDelay()}ms`;

      if (!('IntersectionObserver' in window)) {
        el.classList.add('is-visible');
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              this.observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
      );
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
