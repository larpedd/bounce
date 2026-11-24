// Motion keyframes for the two squishy rectangles.
// Positions are sampled from the reference; everything is generated from these few keys.
export type Keyframe = [frame: number, value: number];

export type Flip = {
  start: number;
  end: number;
  axis: "Y" | "Z";
};

export type Motion = {
  color: string;
  x: Keyframe[];
  jumpPeriod: number;
  jumpStart: number;
  flips: Flip[];
};

export const BASE_WIDTH = 252;
export const BASE_HEIGHT = 280;
export const STRETCH = 34;
export const GROUND_BOTTOM = 502;
export const RISE = 94;

export const RED: Motion = {
  color: "#fe0000",
  x: [
    [0, 474],
    [33, 117],
    [43, 161],
    [81, 455],
    [113, 205],
    [129, 253],
    [161, 359],
    [196, 166],
    [218, 300],
  ],
  jumpPeriod: 16,
  jumpStart: 1.3,
  flips: [
    { start: 33, end: 43, axis: "Y" },
    { start: 113, end: 123, axis: "Y" },
    { start: 209, end: 218, axis: "Y" },
  ],
};

export const BLUE: Motion = {
  color: "#0000fe",
  x: [
    [0, 270],
    [31, 538],
    [60, 386],
    [92, 503],
    [140, 377],
    [155, 429],
    [196, 416],
    [218, 430],
  ],
  jumpPeriod: 11.56,
  jumpStart: 4.6,
  flips: [
    { start: 45, end: 64, axis: "Z" },
    { start: 106, end: 123, axis: "Z" },
    { start: 197, end: 212, axis: "Z" },
  ],
};
