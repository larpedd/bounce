import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from "remotion";
import {BLUE_KEYFRAMES, FRONT, Keyframe, RED_KEYFRAMES} from "./data";

export const WIDTH = 720;
export const HEIGHT = 720;
export const DURATION = 219;
export const FPS = 30;

const atFrame = (keyframes: Keyframe[], frame: number): [number, number, number, number] => {
  if (frame <= keyframes[0][0]) return [keyframes[0][1], keyframes[0][2], keyframes[0][3], keyframes[0][4]];
  const last = keyframes[keyframes.length - 1];
  if (frame >= last[0]) return [last[1], last[2], last[3], last[4]];
  for (let i = 1; i < keyframes.length; i++) {
    const [f1, x1, y1, w1, h1] = keyframes[i - 1];
    const [f2, x2, y2, w2, h2] = keyframes[i];
    if (frame <= f2) {
      const t = (frame - f1) / (f2 - f1);
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, w1 + (w2 - w1) * t, h1 + (h2 - h1) * t];
    }
  }
  return [last[1], last[2], last[3], last[4]];
};

const Shape: React.FC<{rect: [number, number, number, number]; fill: string}> = ({rect, fill}) => (
  <div
    style={{
      position: "absolute",
      left: rect[0],
      top: rect[1],
      width: rect[2],
      height: rect[3],
      backgroundColor: fill,
    }}
  />
);

export const Bounce: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.min(Math.max(frame, 0), DURATION - 1);

  const redRect = atFrame(RED_KEYFRAMES, f);
  const blueRect = atFrame(BLUE_KEYFRAMES, f);
  const redOnTop = FRONT[f] === 0;

  const redShape = <Shape rect={redRect} fill="#fe0000" />;
  const blueShape = <Shape rect={blueRect} fill="#0000fe" />;

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
      <Audio src={staticFile("reference.mp4")} />
    </AbsoluteFill>
  );
};