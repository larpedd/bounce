import {useCurrentFrame, AbsoluteFill, Img, Audio, staticFile} from "remotion";
import {QUAD_STRINGS_RED, QUAD_STRINGS_BLUE, FRONT, parseQuad} from "./data";

export const WIDTH = 720;
export const HEIGHT = 720;
export const DURATION = 219;
export const FPS = 30;

const pointsOf = (quad: number[]): string =>
  `${quad[0]},${quad[1]} ${quad[2]},${quad[3]} ${quad[4]},${quad[5]} ${quad[6]},${quad[7]}`;

const Shape: React.FC<{quad: number[]; fill: string}> = ({quad, fill}) => (
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

  const redQuad = parseQuad(QUAD_STRINGS_RED[f]);
  const blueQuad = parseQuad(QUAD_STRINGS_BLUE[f]);
  const redOnTop = FRONT[f] === 0;

  const redShape = <Shape quad={redQuad} fill="#fe0000" />;
  const blueShape = <Shape quad={blueQuad} fill="#0000fe" />;

  return (
    <AbsoluteFill style={{backgroundColor: "#ffffff"}}>
      {/* background plate: white canvas, borders, green band and caption */}
      <Img
        src={staticFile(`bg/${String(f).padStart(3, "0")}.png`)}
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
