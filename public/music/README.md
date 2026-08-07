# 🎵 music/

The site is wired up to play **Sunehra — Lost Stories, Jai Dhir**.

## What you need to do

Put the audio file here, named exactly:

```
public/music/sunehra.mp3
```

That's the only step. The path is already set in
[`src/app/birthday.config.ts`](../../src/app/birthday.config.ts) under `music`.

I can't fetch the track for you — it's commercial music, so the file has to come
from a copy you own (a purchased download, or an offline export from a service
you subscribe to).

## How it behaves

- **Starts on the gift box tap.** The song begins the instant she opens her
  present, and fades up from silence over ~2.6 seconds rather than bursting in.
- **Loops** for as long as she's on the page.
- **Plays at 55% volume**, so it sits under the page rather than dominating it.
- **The floating pill** in the bottom-right pauses and restarts it, and shows
  the song name with a little equaliser while it plays.
- **If the file is missing**, the button quietly disappears and everything else
  works exactly as before — nothing breaks.

## Why it starts on the tap and not on page load

Every mobile browser blocks audio that starts on its own. The only way a song
can play is if it begins inside a real user interaction. The gift box tap is
that interaction, which is why the song is hooked to it — and why it's hooked to
the tap itself rather than to the animation finishing, since iOS won't accept a
`play()` call that arrives after a timeout.

If autoplay is refused anyway, the button stays on screen so she can start it
by hand.

## Other formats

`.mp3` is the safest choice. `.m4a` and `.ogg` also work — just rename the file
and update `music.src` in the config to match.
