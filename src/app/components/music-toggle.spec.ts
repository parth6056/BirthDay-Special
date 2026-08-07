import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicToggle } from './music-toggle';

describe('MusicToggle', () => {
  let fixture: ComponentFixture<MusicToggle>;
  let toggle: any;
  let audio: HTMLAudioElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MusicToggle] }).compileComponents();
    fixture = TestBed.createComponent(MusicToggle);
    fixture.detectChanges();
    await fixture.whenStable();

    toggle = fixture.componentInstance;
    audio = toggle.player().nativeElement;
    audio.pause = () => {};
  });

  afterEach(() => fixture.destroy());

  it('starts silent so the song can fade up rather than burst in', async () => {
    audio.play = () => Promise.resolve();

    await toggle.start();

    expect(toggle.playing()).toBe(true);
    expect(audio.volume).toBe(0);
  });

  it('keeps the button when autoplay is refused, so she can start it herself', async () => {
    audio.play = () => Promise.reject(new Error('NotAllowedError'));

    await toggle.start();

    expect(toggle.playing()).toBe(false);
    expect(toggle.available()).toBe(true);
  });

  it('drops the button when an explicit tap fails — the file is missing', async () => {
    audio.play = () => Promise.reject(new Error('NotSupportedError'));

    await toggle.toggle();

    expect(toggle.available()).toBe(false);
  });

  it('does not restart the song if it is already playing', async () => {
    let plays = 0;
    audio.play = () => {
      plays++;
      return Promise.resolve();
    };

    await toggle.start();
    await toggle.start();

    expect(plays).toBe(1);
  });

  it('pauses on tap while playing, and resumes on the next one', async () => {
    let paused = false;
    audio.play = () => Promise.resolve();
    audio.pause = () => {
      paused = true;
    };

    await toggle.start();
    await toggle.toggle();
    expect(paused).toBe(true);
    expect(toggle.playing()).toBe(false);

    await toggle.toggle();
    expect(toggle.playing()).toBe(true);
  });
});
