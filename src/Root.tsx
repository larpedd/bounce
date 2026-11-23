import {Composition} from "remotion";
import {Bounce, WIDTH, HEIGHT, DURATION, FPS} from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Bounce"
        component={Bounce}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
