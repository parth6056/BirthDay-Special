import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { BIRTHDAY } from './birthday.config';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should greet her by name once the gift box is opened', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('app-intro-gate .gift')?.click();
    await fixture.whenStable();

    expect(compiled.querySelector('h1')?.textContent).toContain(BIRTHDAY.name);
  });
});
