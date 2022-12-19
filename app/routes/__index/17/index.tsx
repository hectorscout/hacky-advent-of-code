import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { testInput, realInput } from "~/routes/__index/17/input";

const SHAPES_TO_DROP = 21;

type Position = [number, number];
type Pillar = boolean[][];
type Shape = boolean[][];

const SQUARE: Shape = [
  [true, true],
  [true, true],
];
const FLAT: Shape = [[true, true, true, true]];
const TALL: Shape = [[true], [true], [true], [true]];
const PLUS: Shape = [
  [false, true, false],
  [true, true, true],
  [false, true, false],
];
const SEVEN: Shape = [
  [true, true, true],
  [false, false, true],
  [false, false, true],
];
const SHAPE_ORDER: Shape[] = [FLAT, PLUS, SEVEN, TALL, SQUARE];

const EMPTY_ROW: boolean[] = [
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  true,
];

const printPillar = (pillar: Pillar, shape: Shape, shapePosition: Position) => {
  console.log(shapePosition);
  let lines: string[] = [];
  for (let i = pillar.length - 1; i >= 0; i--) {
    let pillarStr = ``;
    pillar[i].forEach((isRock) => {
      pillarStr += isRock ? "#" : ".";
    });
    lines.push(pillarStr);
  }
  shape.forEach((row, i) => {
    row.forEach((isRock, j) => {
      if (isRock) {
        const line = lines[lines.length - shapePosition[0] - 1 - i];
        lines[lines.length - shapePosition[0] - 1 - i] =
          line.substring(0, shapePosition[1] + j) +
          "@" +
          line.substring(shapePosition[1] + j + 1);
      }
    });
  });
  console.log(
    lines
      // .slice(0, 20)
      .map((line, i) => `${lines.length - 1 - i}${line}`)
      .join("\n")
  );
};

const padTopOfPillar = (pillar: Pillar) => {
  for (let i = pillar.length - 8; i < pillar.length - 1; i++) {
    if (pillar[i].slice(1, pillar[i].length - 2).every((isRock) => !isRock)) {
      return;
    }
    pillar.push([...EMPTY_ROW]);
  }
};

const checkPosition = (
  shape: Shape,
  pillar: Pillar,
  position: Position,
  log: boolean
) => {
  return shape.every((row, i) =>
    row.every((isRock, j) => {
      const isValid =
        !pillar[position[0] + i] ||
        !(pillar[position[0] + i][position[1] + j] && isRock);
      if (log)
        console.log(
          !pillar[position[0] + i][position[1] + j],
          i,
          j,
          position[0] + i,
          position[1] + j,
          isRock,
          isValid
        );
      return isValid;
    })
  );
};

const moveLeftRight = (
  isLeft: boolean,
  shape: Shape,
  pillar: Pillar,
  currentPosition: Position,
  log: boolean
) => {
  const positionToCheck: Position = [
    currentPosition[0],
    currentPosition[1] + (isLeft ? -1 : 1),
  ];

  if (log) console.log({ current: currentPosition, check: positionToCheck });
  // console.log("left/right");
  return checkPosition(shape, pillar, positionToCheck, log)
    ? positionToCheck
    : currentPosition;
};

const moveDown = (
  shape: Shape,
  pillar: Pillar,
  currentPosition: Position,
  log: boolean
) => {
  const positionToCheck: Position = [
    currentPosition[0] - 1,
    currentPosition[1],
  ];

  return checkPosition(shape, pillar, positionToCheck, log)
    ? positionToCheck
    : currentPosition;
};

const setRock = (shape: Shape, pillar: Pillar, position: Position) => {
  // console.log("setting rock", position);
  shape.forEach((row, i) => {
    row.forEach((isRock, j) => {
      if (isRock) {
        pillar[position[0] + i][position[1] + j] = true;
      }
    });
  });
};

const dropRock = (
  shape: Shape,
  puffOrder: string,
  puffCount: number,
  pillar: Pillar,
  log: boolean
) => {
  let currentPosition: Position = [pillar.length - 5, 3];
  // console.log("start", shape, currentPosition);
  let newPuffCount = puffCount;
  let keepFalling = true;

  while (keepFalling) {
    const puffDirection = puffOrder[newPuffCount % puffOrder.length];
    if (!["<", ">"].includes(puffDirection))
      console.log("********************************", puffDirection);
    if (log) {
      console.log(puffDirection, puffDirection === "<");
      printPillar(pillar, shape, currentPosition);
    }
    // console.log(puffDirection);
    // Move left/right (increment count)
    currentPosition = moveLeftRight(
      puffDirection === "<",
      shape,
      pillar,
      currentPosition,
      log
    );
    newPuffCount++;

    // Move down
    // currentPosition = moveDown(shape, pillar, currentPosition);
    const downPosition: Position = [currentPosition[0] - 1, currentPosition[1]];
    if (log) console.log("down");

    if (checkPosition(shape, pillar, downPosition, log)) {
      currentPosition = downPosition;
    } else {
      if (log) console.log("setting", shape, currentPosition);
      setRock(shape, pillar, currentPosition);
      keepFalling = false;
    }
  }
  return newPuffCount;
};

const dropRocks = (puffOrder: string) => {
  const pillar: boolean[][] = [
    [...EMPTY_ROW].fill(true, 0, 8),
    [...EMPTY_ROW],
    [...EMPTY_ROW],
    [...EMPTY_ROW],
    [...EMPTY_ROW],
    [...EMPTY_ROW],
    [...EMPTY_ROW],
    [...EMPTY_ROW],
    [...EMPTY_ROW],
  ];

  let puffCount = 0;
  for (let i = 0; i < SHAPES_TO_DROP; i++) {
    puffCount =
      dropRock(
        SHAPE_ORDER[i % SHAPE_ORDER.length],
        puffOrder,
        puffCount,
        pillar,
        i === SHAPES_TO_DROP - 1
      ) % puffOrder.length;
    padTopOfPillar(pillar);
    // console.log(puffCount, puffOrder.length);
    // printPillar(pillar);
  }
  printPillar(pillar, [], [0, 0]);
  console.log(pillar.length);
};

export const loader = ({ request }: LoaderArgs) => {
  console.log("Part I");
  console.log("test");
  dropRocks(testInput);
  console.log("real");
  dropRocks(realInput);

  console.log("Part II");

  return json({
    test: "test",
    real: "real",
  });
};

export default function PyroclasticFlow() {
  const { real, test } = useLoaderData();

  return (
    <div>
      <div>Test: {test}</div>
      <div>Real: {real}</div>
    </div>
  );
}
