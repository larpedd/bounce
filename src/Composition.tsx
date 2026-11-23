import {useCurrentFrame, AbsoluteFill, Img, Audio, staticFile} from "remotion";
import {QUAD_STRINGS_RED, QUAD_STRINGS_BLUE, FRONT, parseQuad, Quad} from "./data";

export const WIDTH = 720;
export const HEIGHT = 720;
export const DURATION = 219;
export const FPS = 30;

// Pre-parse the per-frame quads once at module load (lossless — same values
// the strings encode). Frame-by-frame geometry is preserved exactly.
const RED_FRAMES: Quad[] = QUAD_STRINGS_RED.map(parseQuad);
const BLUE_FRAMES: Quad[] = QUAD_STRINGS_BLUE.map(parseQuad);

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