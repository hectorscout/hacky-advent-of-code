import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { realInput, testInput } from "~/routes/__index/14/input";

enum STATES {
  air = " ",
  sand = ".",
  rock = "R",
}
type Grid = STATES[][];

type Point = [number, number];

type Boundaries = {
  x: { min: number; max: number };
  y: { min: number; max: number };
};

type Offset = [number, number];

const printCave = (cave: Grid) => {
  let caveStr = "\n";
  for (let y = 0; y < cave[0].length; y++) {
    caveStr += ".";
    for (let x = 0; x < cave.length; x++) {
      caveStr += cave[x][y];
    }
    caveStr += ".\n";
  }
  console.log(caveStr);
};

const getPoint = (pointStr: string, offsets: Offset = [0, 0]): Point => {
  // We're trusting our input...
  return pointStr.split(",").map((coord, i) => +coord - offsets[i]) as Point;
};

const X_PADDING = 160;
const SAFETY_LOOPS = 30000;
const getBoundaries = (input: string, withFloor: boolean = false) => {
  const lines = input.split("\n");
  return lines.reduce(
    (boundaries, line) => {
      line.split(" -> ").forEach((point) => {
        const [x, y] = getPoint(point);
        boundaries.x.min = Math.min(boundaries.x.min, x - X_PADDING);
        boundaries.y.min = Math.min(boundaries.y.min, y);
        boundaries.x.max = Math.max(boundaries.x.max, x + X_PADDING);
        boundaries.y.max = Math.max(boundaries.y.max, withFloor ? y + 1 : y);
      });
      return boundaries;
    },
    { x: { min: Infinity, max: -1 }, y: { min: 0, max: -1 } }
  );
};

const getOffsets = (boundaries: Boundaries): Offset => {
  return [boundaries.x.min, boundaries.y.min];
};

const getEmptyCave = (boundaries: Boundaries, offset: Offset) => {
  const grid: Grid = [];

  for (let x = boundaries.x.min; x <= boundaries.x.max; x++) {
    grid.push([]);
    for (let y = boundaries.y.min; y <= boundaries.y.max; y++) {
      grid[x - offset[0]].push(STATES.air);
    }
  }

  return grid;
};

const buildCave = (input: string, withFloor: boolean = false) => {
  const boundaries = getBoundaries(input, withFloor);
  console.log(boundaries);
  console.log(
    "x",
    boundaries.x.max - boundaries.x.min,
    "y",
    boundaries.y.max - boundaries.y.min
  );
  const offsets = getOffsets(boundaries);

  const cave = getEmptyCave(boundaries, offsets);

  printCave(cave);

  const lines = input.split("\n");
  const { grid } = lines.reduce(
    (accum, line) => {
      const points = line.split(" -> ");
      let lastPoint = getPoint(points.shift()!, offsets);
      accum.grid[lastPoint[0]][lastPoint[1]] = STATES.rock;
      while (points.length) {
        const curPoint = getPoint(points.shift()!, offsets);
        accum.grid[curPoint[0]][curPoint[1]] = STATES.rock;
        if (curPoint[0] > lastPoint[0]) {
          for (let i = lastPoint[0]; i < curPoint[0]; i++) {
            accum.grid[i][curPoint[1]] = STATES.rock;
          }
        }
        if (curPoint[0] < lastPoint[0]) {
          for (let i = curPoint[0]; i < lastPoint[0]; i++) {
            accum.grid[i][curPoint[1]] = STATES.rock;
          }
        }
        if (curPoint[1] > lastPoint[1]) {
          for (let i = lastPoint[1]; i < curPoint[1]; i++) {
            accum.grid[curPoint[0]][i] = STATES.rock;
          }
        }
        if (curPoint[1] < lastPoint[1]) {
          for (let i = curPoint[1]; i < lastPoint[1]; i++) {
            accum.grid[curPoint[0]][i] = STATES.rock;
          }
        }

        lastPoint = curPoint;
      }
      return accum;
    },
    { grid: cave as Grid }
  );
  printCave(cave);
  return { cave, offsets };
};

const OVER_THE_EDGE = [Infinity, Infinity] as Point;

const moveSandGrain = (
  cave: Grid,
  location: Point,
  withFloor: boolean = false
): Point => {
  const [x, y] = location;
  if (!withFloor && cave[x][y + 1] === undefined) {
    return OVER_THE_EDGE;
  }
  if (cave[x][y + 1] === STATES.air) {
    return [x, y + 1];
  }
  if (cave[x - 1] === undefined) {
    return OVER_THE_EDGE;
  }
  if (cave[x - 1][y + 1] === STATES.air) {
    return [x - 1, y + 1];
  }
  if (cave[x + 1] === undefined) {
    return OVER_THE_EDGE;
  }
  if (cave[x + 1][y + 1] === STATES.air) {
    return [x + 1, y + 1];
  }
  return location;
};

const dropSand = (cave: Grid, offsets: Offset, withFloor: boolean = false) => {
  const initialLocation = [500 - offsets[0], 0] as Point;
  let currentLocation = initialLocation;

  let done = false;
  while (!done) {
    let nextLocation = moveSandGrain(cave, currentLocation, withFloor);
    if (nextLocation === currentLocation) {
      //sand stopped
      cave[currentLocation[0]][currentLocation[1]] = STATES.sand;
      done = true;
    } else if (nextLocation === OVER_THE_EDGE) {
      // We're done
      done = true;
    }
    currentLocation = nextLocation;
  }

  // console.log(
  //   currentLocation,
  //   initialLocation,
  //   currentLocation !== initialLocation
  // );
  // return if we should keep going or not
  return (
    currentLocation !== OVER_THE_EDGE && currentLocation !== initialLocation
  );
};

const getSandCount = (input: string, withFloor: boolean = false) => {
  const { cave, offsets } = buildCave(input, withFloor);

  let sandCount = 0;
  let shouldContinue = true;
  while (shouldContinue && sandCount < SAFETY_LOOPS) {
    shouldContinue = dropSand(cave, offsets, withFloor);
    shouldContinue ? sandCount++ : null;
  }

  printCave(cave);
  console.log(withFloor ? sandCount + 1 : sandCount);
};

export const loader = ({ request }: LoaderArgs) => {
  console.log("Part I");
  getSandCount(testInput);
  getSandCount(realInput);

  console.log("Part II");
  getSandCount(testInput, true);
  getSandCount(realInput, true);

  return json({
    test: "test",
    real: "real",
  });
};

export default function RegolithReservoir() {
  const { real, test } = useLoaderData();

  return (
    <div>
      <div>Test: {test}</div>
      <div>Real: {real}</div>
    </div>
  );
}
