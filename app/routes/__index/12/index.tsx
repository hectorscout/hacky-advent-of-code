import { useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/node";
import { realInput, testInput } from "~/routes/__index/12/input";

type Node = {
  x: number;
  y: number;
  height: number;
  neighbors: Node[];
  distance: number;
  visited: boolean;
};

type Graph = Record<string, Node>;

const initializeNodes = (input: string) => {
  const rows = input.split("\n");
  const graph: Record<string, Node> = {};
  const start = { x: 0, y: 0 };
  const end = { x: 0, y: 0 };
  rows.forEach((row, x) => {
    for (let y = 0; y < row.length; y++) {
      graph[`${x}, ${y}`] = {
        x,
        y,
        height: row.charCodeAt(y),
        neighbors: [],
        distance: Infinity,
        visited: false,
      };
      if (row[y] === "S") {
        start.x = x;
        start.y = y;
        graph[`${x}, ${y}`].height = "a".charCodeAt(0);
      }
      if (row[y] === "E") {
        end.x = x;
        end.y = y;
        graph[`${x}, ${y}`].height = "z".charCodeAt(0);
      }
    }
  });
  return { start, end, graph };
};

const setNewStart = (graph: Graph, start: { x: number; y: number }) => {
  for (const key in graph) {
    const node = graph[key];
    node.distance = Infinity;
    node.visited = false;
    if (node.x === start.x && node.y === start.y) {
      node.distance = 0;
    }
  }
};

const populateNeighbors = (graph: Graph, downhill: boolean = false) => {
  for (const key in graph) {
    const node = graph[key];
    const { x, y } = node;
    node.neighbors = [
      graph[`${x - 1}, ${y}`],
      graph[`${x}, ${y - 1}`],
      graph[`${x + 1}, ${y}`],
      graph[`${x}, ${y + 1}`],
    ].filter(
      (x) =>
        !!x &&
        (downhill ? x.height >= node.height + -1 : x.height <= node.height + 1)
    );
  }
};

const getMinUnvisitedNode = (graph: Graph) => {
  let minNode: Node | null = null;
  for (const key in graph) {
    const node = graph[key];
    if (!node.visited && (!minNode || minNode.distance > node.distance)) {
      minNode = node;
    }
  }
  return minNode;
};

const populateDistances = (graph: Graph) => {
  let currentNode = getMinUnvisitedNode(graph);
  while (currentNode) {
    currentNode.visited = true;

    currentNode.neighbors.forEach((neighbor) => {
      neighbor.distance = Math.min(
        currentNode!.distance + 1,
        neighbor.distance
      );
    });
    currentNode = getMinUnvisitedNode(graph);
  }
};

// Part I
const makeGraph = (input: string) => {
  const { start, end, graph } = initializeNodes(input);
  setNewStart(graph, start);
  populateNeighbors(graph);
  populateDistances(graph);
  return { start, end, graph };
};
// Part II
const getMinPath = (input: string) => {
  const { end, graph } = initializeNodes(input);
  setNewStart(graph, end);
  populateNeighbors(graph, true);
  populateDistances(graph);
  let minPath = Infinity;
  const rows = input.split("\n");

  rows.forEach((row, x) => {
    for (let y = 0; y < row.length; y++) {
      if (row[y] === "a" || row[y] === "S") {
        minPath = Math.min(minPath, graph[`${x}, ${y}`].distance);
      }
    }
  });
  return minPath;
};

export const loader = ({ request }: LoaderArgs) => {
  const { end: testEnd, graph: testGraph } = makeGraph(testInput);
  const { end: realEnd, graph: realGraph } = makeGraph(realInput);
  const testDistance = testGraph[`${testEnd.x}, ${testEnd.y}`].distance;
  const realDistance = realGraph[`${realEnd.x}, ${realEnd.y}`].distance;
  console.log("Part I");
  console.log(testEnd, testDistance);
  console.log(realEnd, realDistance);

  console.log("Part II");
  const testMinPath = getMinPath(testInput);
  console.log("test", testMinPath);
  const realMinPath = getMinPath(realInput);
  console.log("real", realMinPath);

  return json({
    test: {
      partI: testDistance,
      partII: testMinPath,
    },
    real: {
      partI: realDistance,
      partII: realMinPath,
    },
  });
};

export default function HillClimbing() {
  const { real, test } = useLoaderData();

  return (
    <div>
      <div>Part I</div>
      <div>Test: {test.partI}</div>
      <div>Real: {real.partI}</div>
      <div>Part II</div>
      <div>Test: {test.partII}</div>
      <div>Real: {real.partII}</div>
    </div>
  );
}
