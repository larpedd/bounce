import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  BASE_HEIGHT,
  BASE_WIDTH,
  BLUE,
  GROUND_BOTTOM,
  RED,
  RISE,
  STRETCH,
  type Motion,
} from "./data";

export const WIDTH = 720;
export const HEIGHT = 720;
export const DURATION = 219;
export const FPS = 30;

const jumpAt = (frame: number, motion: Motion): number => {
  if (frame < motion.jumpStart) {
    return 0;
  }

  return Math.abs(
    Math.sin((Math.PI * (frame - motion.jumpStart)) / motion.jumpPeriod),
  );
};

const xAt = (frame: number, motion: Motion): number =>
  interpolate(
    frame,
    motion.x.map(([key]) => key),
    motion.x.map(([, value]) => value),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

const flipAt = (frame: number, motion: Motion): string => {
  const flip = motion.flips.find(
    ({ start, end }) => frame >= start && frame <= end,
  );
  if (!flip) {
    return "";
  }

  const angle = interpolate(frame, [flip.start, flip.end], [0, 180], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return ` ${flip.axis === "Y" ? "rotateY" : "rotateZ"}(${angle}deg)`;
};

const Rectangle: React.FC<{
  motion: Motion;
  frame: number;
  zIndex: number;
}> = ({ motion, frame, zIndex }) => {
  const jump = jumpAt(frame, motion);
  const squish = jump * jump;
  const width = BASE_WIDTH + STRETCH * squish;
  const height = BASE_HEIGHT - STRETCH * squish;
  const x = xAt(frame, motion);
  const y = GROUND_BOTTOM - RISE * jump - height;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width,
        height,
        background: motion.color,
        transformOrigin: "center center",
        transform: `translate3d(${x - width / 2}px, ${y}px, 0) perspective(700px)${flipAt(
          frame,
          motion,
        )}`,
        zIndex,
      }}
    />
  );
};

export const Bounce: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      {/* Static background plate: white canvas, borders, green band and caption. */}
      <Img
        src={staticFile("bg-static.png")}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: WIDTH,
          height: HEIGHT,
        }}
      />

      <Rectangle motion={BLUE} frame={frame} zIndex={1} />
      <Rectangle motion={RED} frame={frame} zIndex={2} />

      {/* original audio track from bounce_reference.mp4 */}
      <Audio src={staticFile("reference.mp4")} />
    </AbsoluteFill>
  );
};
