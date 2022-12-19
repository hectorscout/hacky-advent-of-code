import { useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/node";
import { realInput, testInput } from "./input";

type Point = [number, number];

const INFINITE_POINT: Point = [Infinity, Infinity];
const TEST_BOUNDARY = 20;
const REAL_BOUNDARY = 4_000_000;

const getDistance = (a: Point, b: Point) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const isInBoundary = (point: Point, boundary: number) => {
  if (!boundary) return true;
  return (
    point[0] >= 0 && point[0] < boundary && point[1] >= 0 && point[1] < boundary
  );
};

class Sensor {
  center: Point;
  beacon: Point;
  radius: number;
  perimeterPlusOne: Point[];

  constructor(line: string, boundary: number) {
    const match = line.match(/[-0-9]+/g);
    this.center = [+match![0], +match![1]];
    this.beacon = [+match![2], +match![3]];
    this.radius = getDistance(this.center, this.beacon);
    this.perimeterPlusOne = this.getPerimeterPlusOne(boundary);
  }

  getPerimeterPlusOne(boundary: number) {
    const perimeter: Point[] = [];
    let current: Point = [this.center[0], this.center[1] + this.radius + 1];
    while (getDistance(this.center, current) === this.radius) {
      if (isInBoundary(current, boundary)) {
        perimeter.push(current);
      }
      current = [current[0] - 1, current[1] - 1];
    }
    current = [this.center[0], this.center[1] - this.radius - 1];
    while (getDistance(this.center, current) === this.radius + 1) {
      if (isInBoundary(current, boundary)) {
        perimeter.push(current);
      }
      current = [current[0] + 1, current[1] + 1];
    }
    current = [this.center[0] + this.radius + 1, this.center[1]];
    while (getDistance(this.center, current) === this.radius + 1) {
      if (isInBoundary(current, boundary)) {
        perimeter.push(current);
      }
      current = [current[0] + 1, current[1] - 1];
    }
    current = [this.center[0] - this.radius - 1, this.center[1]];
    while (getDistance(this.center, current) === this.radius + 1) {
      if (isInBoundary(current, boundary)) {
        perimeter.push(current);
      }
      current = [current[0] - 1, current[1] + 1];
    }
    return perimeter;
  }
  findImpossibleForLine(lineNumber: number) {
    const columns: number[] = [];
    if (this.pointIsImpossible([this.center[0], lineNumber])) {
      columns.push(this.center[0]);
      let offset = 1;
      while (
        this.pointIsImpossible([this.center[0] + offset, lineNumber]) &&
        offset < 100000000
      ) {
        columns.push(this.center[0] + offset);
        columns.push(this.center[0] - offset);
        offset++;
      }
    }
    return columns;
  }

  pointIsImpossible(point: Point) {
    return getDistance(point, this.center) <= this.radius;
  }
}

const getSensors = (input: string, boundary: number) => {
  const lines = input.split("\n");

  return lines.map((line) => {
    return new Sensor(line, boundary);
  });
};

const getImpossibleColumnsForRow = (
  input: string,
  row: number,
  boundary: number
) => {
  const columns: Set<number> = new Set();

  const sensors = getSensors(input, boundary);

  sensors.forEach((sensor) => {
    sensor.findImpossibleForLine(row).forEach((column) => {
      columns.add(column);
    });
  });

  sensors.forEach((sensor) => {
    if (sensor.beacon[1] === row) {
      columns.delete(sensor.beacon[0]);
    }
  });

  return columns;
};

const searchPerimeters = (input: string, boundary: number) => {
  const sensors = getSensors(input, boundary);
  for (const i in sensors) {
    for (const j in sensors[i].perimeterPlusOne) {
      let isImpossible = false;
      for (const k in sensors) {
        if (sensors[k].pointIsImpossible(sensors[i].perimeterPlusOne[j])) {
          isImpossible = true;
          continue;
        }
      }
      if (!isImpossible) {
        return sensors[i].perimeterPlusOne[j];
      }
    }
  }
};

// Brute Force (don't do it)
const lookForBeacon = (input: string, limit: number) => {
  const sensors = getSensors(input, limit);
  for (let x = 0; x < limit; x++) {
    for (let y = 0; y < limit; y++) {
      let isImpossible = false;
      for (const i in sensors) {
        if (sensors[i].pointIsImpossible([x, y])) {
          isImpossible = true;
          continue;
        }
      }
      if (!isImpossible) {
        return [x, y];
      }
    }
  }
  return INFINITE_POINT;
};

export const loader = ({ request }: LoaderArgs) => {
  console.log("Part I");
  const testRows = getImpossibleColumnsForRow(testInput, 10, 0);
  const testArray = [...testRows.values()].sort((a, b) => a - b);
  console.log(testArray, testRows.size);
  console.log(getImpossibleColumnsForRow(realInput, 2000000, 0).size);

  console.log("Part II");
  console.log(lookForBeacon(testInput, TEST_BOUNDARY));
  console.log(searchPerimeters(testInput, TEST_BOUNDARY));
  const [x, y] = searchPerimeters(realInput, REAL_BOUNDARY)!;
  console.log([x, y], x * 4000000 + y);
  // console.log(lookForBeacon(realInput, 4000000));

  return json({
    test: "test",
    real: "real",
  });
};

export default function BeaconExclusionZone() {
  const { real, test } = useLoaderData();

  return (
    <div>
      <div>Test: {test}</div>
      <div>Real: {real}</div>
    </div>
  );
}
