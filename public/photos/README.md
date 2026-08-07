# 📸 photos/ — generated, don't edit by hand

Everything in this folder is produced from the original photos sitting in
[`public/`](../) by:

```bash
python scripts/optimize-photos.py
```

That script resizes each picture to 1600px on the long edge, re-encodes it as a
progressive JPEG, fixes iPhone EXIF rotation, and gives it a clean lowercase
name. It never modifies the originals, so it's safe to re-run any time.

Current result: **30.3 MB → 6.1 MB**, which matters a lot when she opens this on
her phone.

## Adding or replacing a photo

1. Drop the new file into [`public/`](../).
2. Add a line to the `RENAMES` map in
   [`scripts/optimize-photos.py`](../../scripts/optimize-photos.py) mapping the
   filename to a clean output name.
3. Run the script.
4. Reference it from the `albums` list in
   [`src/app/birthday.config.ts`](../../src/app/birthday.config.ts).

A test in `src/app/birthday.config.spec.ts` checks that every path in the config
resolves to a real file with matching case, so `npm test` will catch a typo
before she ever sees a broken tile.

## Why the renaming

The originals are named inconsistently — `COuple7.jpeg`, `Her1.jpeg` next to
`her2.jpeg`, `TheTImeiProposedyou.jpeg`. Windows doesn't care about case, but
Netlify, Vercel and GitHub Pages all do, so the site would break on deploy while
working perfectly on your machine.

## Note

`FirstPhotoTogether.jpeg` and `FirstTimeWeClickPhoto.jpeg` in `public/` are
byte-identical (same MD5), so only one copy is used, as `first-photo.jpg`.
