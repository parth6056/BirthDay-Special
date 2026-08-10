/**
 * 💕 EVERYTHING YOU NEED TO EDIT LIVES IN THIS ONE FILE 💕
 *
 * The photos below point at  public/photos/ , which is generated from the
 * originals in  public/  by:
 *
 *     python scripts/optimize-photos.py
 *
 * Re-run that after adding or replacing any picture in public/.
 */

export interface Photo {
  src: string;
  caption: string;
  /** Small rotation in degrees so the polaroids look hand-scattered. */
  tilt?: number;
}

export interface Album {
  title: string;
  blurb: string;
  photos: Photo[];
}

export interface Reason {
  emoji: string;
  front: string;
  back: string;
}

export interface Moment {
  date: string;
  title: string;
  text: string;
  emoji: string;
}

export const BIRTHDAY = {
  /** Her name — used all over the site. */
  name: 'Riddhi',
  /** Who the letter is signed by. */
  from: 'Parth',

  /**
   * Her actual date of birth, YYYY-MM-DD. Everything else is derived from it,
   * so this never needs updating again:
   *   → the countdown targets the next 11 August automatically
   *   → her age is worked out for you
   *   → on the day itself the site flips into celebration mode
   */
  birthDate: '2005-08-11',

  /** Set false to hide the age badge in the hero. */
  showAge: true,

  hero: {
    greeting: 'happy birthday to my favourite person',
    tagline: 'I made you a whole website because a card felt too small.',
  },

  /** The big photo at the very top, above her name. */
  cover: {
    src: '/photos/cover.jpg',
    alt: 'Riddhi',
  },

  /** ── The photo wall, in chapters ─────────────────────────────
   *  Captions are the handwritten lines under each polaroid — swap in the
   *  real stories wherever mine are guesses.
   */
  albums: <Album[]>[
    {
      title: 'just look at her',
      blurb: 'exhibit A through G, your honour.',
      photos: [
        { src: '/photos/her-1.jpg', caption: 'the beach suits you 🌊', tilt: -4 },
        { src: '/photos/her-2.jpg', caption: 'unfairly pretty, as usual', tilt: 3 },
        { src: '/photos/her-3.jpg', caption: 'the saree. the jhumkas. help.', tilt: -2 },
        { src: '/photos/her-4.jpg', caption: 'my favourite view 💗', tilt: 4 },
        { src: '/photos/her-5.jpg', caption: 'she just does this casually', tilt: -5 },
        { src: '/photos/her-6.jpg', caption: 'stop being this cute', tilt: 2 },
        { src: '/photos/her-7.jpg', caption: 'okay now you\'re showing off', tilt: -3 },
      ],
    },
    {
      title: 'before I ever knew you',
      blurb: 'the world got a whole lot better on 11 august 2005.',
      photos: [
        { src: '/photos/birth.jpg', caption: 'day one. 11.08.2005 🕊️', tilt: -3 },
        { src: '/photos/child.jpg', caption: 'birthday girl, original edition 🎂', tilt: 4 },
      ],
    },
    {
      title: 'every date, every time',
      blurb: 'somehow every single one of these is my favourite.',
      photos: [
        { src: '/photos/date-1.jpg', caption: 'us, being disgustingly happy', tilt: -4 },
        { src: '/photos/date-2.jpg', caption: 'that laugh. right there.', tilt: 3 },
        { src: '/photos/date-3.jpg', caption: 'a good, good day', tilt: -2 },
        { src: '/photos/date-4.jpg', caption: 'my shoulder\'s favourite job', tilt: 5 },
        { src: '/photos/date-5.jpg', caption: 'never letting go 🤍', tilt: -3 },
        { src: '/photos/date-6.jpg', caption: 'coffee tastes better with you', tilt: 2 },
        { src: '/photos/date-7.jpg', caption: 'another one for the collection', tilt: -5 },
        { src: '/photos/date-8.jpg', caption: 'you make everywhere feel like somewhere', tilt: 3 },
        { src: '/photos/date-9.jpg', caption: 'matching without even trying 💙', tilt: -2 },
        { src: '/photos/date-10.jpg', caption: 'okay this one\'s my phone wallpaper', tilt: 4 },
      ],
    },
    {
      title: 'you and me',
      blurb: 'my favourite two-word sentence.',
      photos: [
        { src: '/photos/couple-1.jpg', caption: 'us. that\'s the caption.', tilt: -3 },
        { src: '/photos/couple-3.jpg', caption: 'still can\'t believe my luck', tilt: 4 },
        { src: '/photos/couple-4.jpg', caption: 'my whole heart, right here', tilt: -5 },
        { src: '/photos/couple-5.jpg', caption: 'you + me = my favourite maths', tilt: 2 },
        { src: '/photos/couple-6.jpg', caption: 'I\'d live this day on loop', tilt: -2 },
        { src: '/photos/couple-7.jpg', caption: 'forever, if you\'ll have me 💍', tilt: 3 },
      ],
    },
    {
      title: 'the ones that started it all',
      blurb: 'the two photos I\'ll never delete.',
      photos: [
        {
          src: '/photos/first-photo.jpg',
          caption: 'the very first photo of us 🥺',
          tilt: -4,
        },
        {
          src: '/photos/proposal.jpg',
          caption: 'the day I finally asked 💐',
          tilt: 3,
        },
      ],
    },
  ],

  /** ── Flip cards: tap to reveal ──────────────────────────────── */
  reasons: <Reason[]>[
    {
      emoji: '🌸',
      front: 'your laugh',
      back: 'It rearranges my entire day. I would do genuinely embarrassing things to hear it.',
    },
    {
      emoji: '☕',
      front: 'the little things',
      back: 'The way you hold your cup with both hands. The way you say my name when you\'re sleepy.',
    },
    {
      emoji: '🧠',
      front: 'how you think',
      back: 'You notice things nobody else notices, and then you make them sound beautiful.',
    },
    {
      emoji: '🫂',
      front: 'you feel like home',
      back: 'Not the place — the feeling. The exhale after a long day.',
    },
    {
      emoji: '🔥',
      front: 'your stubborn heart',
      back: 'You care so hard about the people you love. I get to be one of them and it still stuns me.',
    },
    {
      emoji: '⭐',
      front: 'you make me better',
      back: 'Somewhere along the way loving you turned into my favourite habit.',
    },
  ],

  /** ── Timeline of us ─────────────────────────────────────────── */
  timeline: <Moment[]>[
    {
      date: '11 august 2005',
      title: 'you arrived',
      text: 'Somewhere a long way from me, the best thing that would ever happen to me was born.',
      emoji: '🕊️',
    },
    {
      date: 'the night we met',
      title: 'our first photo together',
      text: 'I had no idea my whole life was about to reroute around one person.',
      emoji: '✨',
    },
    {
      date: 'the day I asked',
      title: 'flowers, and a very nervous me',
      text: 'I practised what I was going to say. I forgot all of it. You said yes anyway.',
      emoji: '💐',
    },
    {
      date: 'today',
      title: 'your birthday',
      text: 'Celebrating the day the world got significantly cuter.',
      emoji: '🎂',
    },
  ],

  /** ── The letter inside the envelope ─────────────────────────── */
  letter: {
    salutation: 'My dearest Riddhi,',
    /** Each string becomes its own paragraph. */
    paragraphs: [
      'I\'m not great at saying big things out loud, so I built them instead. Every scroll on this page is something I\'ve thought about you and never quite managed to fit into a text message.',
      'Thank you for being patient with me, for laughing at my worst jokes, and for making a completely ordinary life feel like something worth writing about.',
      'I hope today is soft and warm and full of cake, and that you feel even a fraction as adored as you actually are.',
    ],
    signoff: 'all my love, always',
  },

  /** ── Background song ────────────────────────────────────────
   *  Put the audio file at  public/music/sunehra.mp3  (see the README in
   *  that folder). It starts the moment she opens the gift box, and the
   *  floating button lets her pause or restart it.
   *
   *  Set this to null to remove the music entirely.
   */
  music: {
    src: '/music/sunehra.mp3',
    title: 'Sunehra',
    artist: 'Lost Stories, Jai Dhir',
  } as { src: string; title: string; artist: string } | null,
};
