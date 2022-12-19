import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { testInput, input, testInput2 } from "~/routes/__index/09/input";

const getNewPosition = (head: number[], tail: number[]) => {
  // console.log({ head, tail });
  const position = [...tail];
  if (Math.abs(head[0] - tail[0]) > 1 && head[1] === tail[1]) {
    position[0] = head[0] - tail[0] > 0 ? head[0] - 1 : head[0] + 1;
  } else if (Math.abs(head[1] - tail[1]) > 1 && head[0] === tail[0]) {
    position[1] = head[1] - tail[1] > 0 ? head[1] - 1 : head[1] + 1;
  } else if (
    Math.abs(head[1] - tail[1]) > 1 ||
    Math.abs(head[0] - tail[0]) > 1
  ) {
    position[0] = head[0] - tail[0] > 0 ? tail[0] + 1 : tail[0] - 1;
    position[1] = head[1] - tail[1] > 0 ? tail[1] + 1 : tail[1] - 1;
  }
  return position;
};

const getVisitedCount = (movesStr: string) => {
  const moves = movesStr.split("\n").map((move) => move.split(" "));
  const head = [0, 0];
  let knots = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  const visited = new Set(["0,0"]);
  moves.forEach(([direction, distance]) => {
    const axis = ["L", "R"].includes(direction) ? 0 : 1;
    const value = ["R", "U"].includes(direction) ? 1 : -1;
    for (let i = 0; i < +distance; i++) {
      head[axis] += value;
      for (let j = 0; j < knots.length; j++) {
        if (j === 0) {
          knots[j] = getNewPosition(head, knots[j]);
        } else {
          knots[j] = getNewPosition(knots[j - 1], knots[j]);
        }
      }
      visited.add(knots[knots.length - 1].join(","));
    }
  });
  return visited.size;
};

export const loader = ({ request }: LoaderArgs) => {
  return json({
    test: getVisitedCount(testInput2),
    real: getVisitedCount(input),
  });
};

export default function TreeHouse() {
  const { real, test } = useLoaderData();
  return <div>Real: {real}</div>;
}
