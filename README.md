# Bounce

A [Remotion](https://remotion.dev) project that reconstructs `bounce_reference.mp4` — two bouncing rectangles on a white canvas — procedurally instead of replaying the source video.

The composition is 720×720, 30 fps, 219 frames (~7.3 s), registered as `Bounce` in [src/Root.tsx](/home/user/bounce/src/Root.tsx).

## How it works

[src/Composition.tsx](/home/user/bounce/src/Composition.tsx) layers three things per frame:

1. **Static plate** — `public/bg-static.png`, the per-pixel median of all 219 source frames. Keeps the borders, green band and caption while dropping compression noise and inpainting smudges. All motion lives in the two quads.
2. **Two textured quads** — `public/red.png` and `public/blue.png`, warped with `matrix3d` from homographies in [src/data.ts](/home/user/bounce/src/data.ts). Those keyframes come from quad tracking on the reference video; `atFrame` linearly interpolates between them. `FRONT` decides which shape is drawn on top.
3. **Audio** — `public/reference.mp4`, the original audio track.

`public/reference.mp4` is the tracking/audio source; `bounce_reference.mp4` at the repo root is the original input clip.

## Commands

```console
npm i                    # install dependencies
npm run dev              # Remotion Studio preview
npx remotion render Bounce out/video.mp4   # render the video
npm run build            # bundle the composition
npm run lint             # eslint + tsc
npm run upgrade          # upgrade Remotion
```

Render settings live in [remotion.config.ts](/home/user/bounce/remotion.config.ts): rspack, PNG frames, overwrite output, 2 s premount.

## CI

[.github/workflows/render.yml](/home/user/bounce/.github/workflows/render.yml) renders `Bounce` on every push to `main` and on manual dispatch, then uploads `video.mp4` as an artifact.

## Docs

- [Remotion fundamentals](https://www.remotion.dev/docs/the-fundamentals)
- [Help on Discord](https://discord.gg/6VzzNDwUwV)

## License

UNLICENSED. Remotion itself may require a company license for some entities — [terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
