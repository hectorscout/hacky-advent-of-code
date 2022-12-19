import { useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/node";
import { input, testInput } from "~/routes/__index/08/input";

const getVisibility = (row: number, column: number, grid: number[][]) => {
  const height = grid[row][column];
  for (let i = row + 1; i <= grid.length; i++) {
    if (i === grid.length) {
      return true;
    }
    if (grid[i][column] >= height) {
      i = grid.length + 1;
    }
  }
  for (let i = row - 1; i >= -1; i--) {
    if (i === -1) {
      return true;
    }
    if (grid[i][column] >= height) {
      i = -2;
    }
  }
  for (let i = column + 1; i <= grid[row].length; i++) {
    if (i === grid[row].length) {
      return true;
    }
    if (grid[row][i] >= height) {
      i = grid[row].length + 1;
    }
  }
  for (let i = column - 1; i >= -1; i--) {
    if (i === -1) {
      return true;
    }
    if (grid[row][i] >= height) {
      i = -2;
    }
  }
  return false;
};

const getViewingScore = (row: number, column: number, grid: number[][]) => {
  const height = grid[row][column];
  let right = 0;
  for (let i = row + 1; i < grid.length; i++) {
    if (grid[i][column] >= height) {
      i = grid.length;
    }
    right++;
  }
  let left = 0;
  for (let i = row - 1; i >= 0; i--) {
    if (grid[i][column] >= height) {
      i = -1;
    }
    left++;
  }
  let down = 0;
  for (let i = column + 1; i < grid[row].length; i++) {
    if (grid[row][i] >= height) {
      i = grid[row].length;
    }
    down++;
  }
  let up = 0;
  for (let i = column - 1; i >= 0; i--) {
    if (grid[row][i] >= height) {
      i = -1;
    }
    up++;
  }

  return right * left * up * down;
};

const getVisibleTrees = (grid: number[][]) => {
  console.log(grid);
  let visibleCount = 0;
  grid.forEach((row, x) => {
    row.forEach((tree, y) => {
      const isVisible = getVisibility(x, y, grid);
      // console.log("checking", x, y, isVisible);
      visibleCount += isVisible ? 1 : 0;
    });
  });
  return visibleCount;
};

const getBestTree = (grid: number[][]) => {
  let bestTree = 0;
  grid.forEach((row, x) => {
    row.forEach((tree, y) => {
      const visibleScore = getViewingScore(x, y, grid);

      bestTree = Math.max(visibleScore, bestTree);
    });
  });
  return bestTree;
};
const getGrid = (input: string) => {
  const rows = input.split("\n");
  const grid = rows.reduce((accum, row) => {
    const columns = [];
    for (let i = 0; i < row.length; i++) {
      columns.push(+row[i]);
    }
    accum.push(columns);
    return accum;
  }, [] as number[][]);

  return grid;
};
export const loader = ({ request }: LoaderArgs) => {
  const testGrid = getGrid(testInput);
  const testVisibleTrees = getVisibleTrees(testGrid);
  const testBestTree = getBestTree(testGrid);
  const grid = getGrid(input);
  const visibleTrees = getVisibleTrees(grid);
  const bestTree = getBestTree(grid);
  // getVisibility(1, 1, testGrid);
  console.log({ testVisibleTrees, visibleTrees });
  console.log("best: ", { testBestTree, bestTree });
  return json({
    test: "test",
    real: "real",
  });
};
export default function TreeHouse() {
  const { real, test } = useLoaderData();
  return <div>Real: {real}</div>;
}
