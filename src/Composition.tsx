import {AbsoluteFill, Html5Audio, Img, staticFile, useCurrentFrame} from "remotion";
import {BLUE_KEYFRAMES, FRONT, Keyframe, RED_KEYFRAMES} from "./data";

export const WIDTH = 720;
export const HEIGHT = 720;
export const DURATION = 219;
export const FPS = 30;

const SIZE = 100;

type Homography = [number, number, number, number, number, number, number, number];

const atFrame = (keyframes: Keyframe[], frame: number): Homography => {
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  const lerp = (a: Keyframe, b: Keyframe, t: number): Homography => [
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
    a[4] + (b[4] - a[4]) * t,
    a[5] + (b[5] - a[5]) * t,
    a[6] + (b[6] - a[6]) * t,
    a[7] + (b[7] - a[7]) * t,
    a[8] + (b[8] - a[8]) * t,
  ];

  if (frame <= first[0]) return lerp(first, first, 0);
  if (frame >= last[0]) return lerp(last, last, 0);

  for (let i = 1; i < keyframes.length; i++) {
    const a = keyframes[i - 1];
    const b = keyframes[i];
    if (frame <= b[0]) return lerp(a, b, (frame - a[0]) / (b[0] - a[0]));
  }
  return lerp(last, last, 0);
};

const Shape: React.FC<{homography: Homography; src: string}> = ({homography, src}) => {
  const [h11, h12, h13, h21, h22, h23, h31, h32] = homography;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SIZE,
        height: SIZE,
        transformOrigin: "0 0",
        transform: `matrix3d(${h11 / SIZE},${h21 / SIZE},0,${h31 / SIZE},${h12 / SIZE},${h22 / SIZE},0,${h32 / SIZE},0,0,1,0,${h13},${h23},0,1)`,
      }}
    >
      <Img src={src} style={{width: SIZE, height: SIZE, objectFit: "fill"}} />
    </div>
  );
};

export const Bounce: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.min(Math.max(frame, 0), DURATION - 1);

  const redHomography = atFrame(RED_KEYFRAMES, f);
  const blueHomography = atFrame(BLUE_KEYFRAMES, f);
  const redOnTop = FRONT[f] === 0;

  const redShape = <Shape homography={redHomography} src={staticFile("red.png")} />;
  const blueShape = <Shape homography={blueHomography} src={staticFile("blue.png")} />;

  return (
    <AbsoluteFill style={{backgroundColor: "#ffffff"}}>
      {/* Static background plate: white canvas, borders, green band and caption.
          Derived as the per-pixel median of the original 219 video plates, which
          removes compression noise / inpainting smudges while keeping every
          static element. The bouncing rectangles below carry all per-frame motion. */}
      <Img
        src={staticFile("bg-static.png")}
        style={{position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT}}
      />

      {redOnTop ? (
        <>
          {blueShape}
          {redShape}
        </>
      ) : (
        <>
          {redShape}
          {blueShape}
        </>
      )}

      {/* original audio track from bounce_reference.mp4 */}
      <Html5Audio src={staticFile("reference.mp4")} />
    </AbsoluteFill>
  );
};
