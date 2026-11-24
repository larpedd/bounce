import {useCurrentFrame, AbsoluteFill, Img, Audio, staticFile} from "remotion";
import {RED_QUADS, BLUE_QUADS, FRONT, Quad} from "./data";

export const WIDTH = 720;
export const HEIGHT = 720;
export const DURATION = 219;
export const FPS = 30;

const RED_FRAMES = RED_QUADS;
const BLUE_FRAMES = BLUE_QUADS;

const pointsOf = (quad: Quad): string =>
  `${quad[0]},${quad[1]} ${quad[2]},${quad[3]} ${quad[4]},${quad[5]} ${quad[6]},${quad[7]}`;

const Shape: React.FC<{quad: Quad; fill: string}> = ({quad, fill}) => (
  <svg
    width={WIDTH}
    height={HEIGHT}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    style={{position: "absolute", left: 0, top: 0}}
    shapeRendering="auto"
  >
    <polygon points={pointsOf(quad)} fill={fill} />
  </svg>
);

export const Bounce: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.min(Math.max(frame, 0), DURATION - 1);

  const redQuad = RED_FRAMES[f];
  const blueQuad = BLUE_FRAMES[f];
  const redOnTop = FRONT[f] === 0;

  const redShape = <Shape quad={redQuad} fill="#fe0000" />;
  const blueShape = <Shape quad={blueQuad} fill="#0000fe" />;

  return (
    <AbsoluteFill style={{backgroundColor: "#ffffff"}}>
      {/* Static background plate: white canvas, borders, green band and caption.
          Derived as the per-pixel median of the original 219 video plates, which
          removes compression noise / inpainting smudges while keeping every
          static element. The bouncing quads below carry all per-frame motion. */}
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