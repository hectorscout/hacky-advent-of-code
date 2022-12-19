import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { realInput, testInput } from "~/routes/__index/16/input";

type Node = {
  name: string;
  rate: number;
  neighbors: Node[];
  distance: number;
  visited: boolean;
};

const getMinUnvisitedNode = (nodes: Record<string, Node>): Node | null => {
  let minNode: Node | null = null;
  for (const key in nodes) {
    const node = nodes[key];
    if (!node.visited && (!minNode || minNode.distance > node.distance)) {
      minNode = node;
    }
  }
  return minNode;
};

class Tunnel {
  name: string;
  rate: number;
  neighbors: string[];
  neighborTunnels: Tunnel[];

  isOpen: boolean;

  distanceGraph: Record<string, Node>;

  constructor(name: string, rate: string, neighbors: string) {
    this.name = name;
    this.rate = +rate;
    this.isOpen = false;
    this.neighbors = neighbors.split(", ");
    this.neighborTunnels = [];
    this.distanceGraph = {};
  }

  populateNeighbors(tunnels: Record<string, Tunnel>) {
    this.neighborTunnels = this.neighbors.map((neighbor) => tunnels[neighbor]);
  }

  populateDistanceGraph(tunnels: Record<string, Tunnel>) {
    const nodes: Record<string, Node> = Object.values(tunnels).reduce(
      (graph, tunnel) => {
        graph[tunnel.name] = {
          name: tunnel.name,
          rate: tunnel.rate,
          distance: tunnel.name === this.name ? 0 : Infinity,
          neighbors: [],
          visited: false,
        };
        return graph;
      },
      {} as Record<string, Node>
    );

    for (const key in nodes) {
      const node = nodes[key];
      node.neighbors = tunnels[key].neighbors.map(
        (name: string) => nodes[name]
      );
    }

    let currentNode = getMinUnvisitedNode(nodes);
    while (currentNode) {
      currentNode.visited = true;

      currentNode.neighbors.forEach((neighbor) => {
        neighbor.distance = Math.min(
          currentNode!.distance + 1,
          neighbor.distance
        );
      });
      currentNode = getMinUnvisitedNode(nodes);
    }
    this.distanceGraph = nodes;
  }
}

const getGraph = (input: string) => {
  const lines = input.split("\n");

  const graph = lines.reduce((graph, line) => {
    const match = line.match(
      /Valve ([A-Z]*) has flow rate=([\d]*); tunnel[s]? lead[s]? to valve[s]? (.*)/
    );
    // console.log(match);
    graph[match![1]] = new Tunnel(match![1], match![2], match![3]);
    return graph;
  }, {} as Record<string, Tunnel>);

  for (const key in graph) {
    graph[key].populateNeighbors(graph);
    graph[key].populateDistanceGraph(graph);
  }

  return graph;
};

const getBestMove = (
  graph: Record<string, Tunnel>,
  currentTunnel: Tunnel,
  time: number
) => {
  let bestMove = { name: "", time: time, relief: 0 };
  for (const key in graph) {
    const tunnel = graph[key];
    if (!tunnel.isOpen) {
      // console.log("tunnel", tunnel);
      const relief =
        (time - currentTunnel.distanceGraph[key].distance - 1) * tunnel.rate;
      if (relief > bestMove.relief) {
        // console.log({
        //   name: tunnel.name,
        //   time: currentTunnel.distanceGraph[key],
        // });
        bestMove = {
          name: tunnel.name,
          time: time - currentTunnel.distanceGraph[key].distance - 1,
          relief,
        };
      }
    }
  }
  return bestMove;
};

const getBestRelief = (
  graph: Record<string, Tunnel>,
  time: number,
  tunnel: Tunnel,
  alreadyOn: Set<string>
) => {
  if (time <= 0 || alreadyOn.size === Object.keys(graph).length) {
    return 0;
  }
  let bestRelief = 0;
  const isOn = alreadyOn.has(tunnel.name);
  const newAlreadyOn = new Set(alreadyOn);
  newAlreadyOn.add(tunnel.name);
  const timeToSubtract = tunnel.rate ? 2 : 1;
  tunnel.neighborTunnels.forEach((neighbor) => {
    const relief = getBestRelief(
      graph,
      time - timeToSubtract,
      neighbor,
      newAlreadyOn
    );
    if (relief > bestRelief) bestRelief = relief;
  });
  return bestRelief + (time - 1) * (isOn ? 0 : tunnel.rate);
};

const treeSearchIt = (input: string) => {
  const graph = getGraph(input);
  // let relief = 0;
  let time = 30;
  let currentTunnel = graph["AA"];

  return getBestRelief(graph, time, currentTunnel, new Set());
};

const getPermutations = (
  currentValve: Tunnel,
  time: number,
  valves: Tunnel[]
): Tunnel[][] => {
  if (time <= 0) return [];
  if (valves.length <= 2)
    return valves.length === 2 ? [valves, [valves[1], valves[0]]] : [valves];
  return valves.reduce((acc, tunnel, i) => {
    return acc.concat(
      getPermutations(
        valves[0],
        time - currentValve.distanceGraph[valves[0].name].distance,
        [...valves.slice(0, i), ...valves.slice(i + 1)]
      ).map((val: Tunnel[]) => [tunnel, ...val])
    );
  }, [] as Tunnel[][]);
};
const tryAllOrders = (input: string) => {
  const graph = getGraph(input);
  const valvesToTry: Tunnel[] = Object.values(graph).reduce(
    (valves, tunnel) => {
      if (tunnel.rate) valves.push(tunnel);
      return valves;
    },
    [] as Tunnel[]
  );

  console.log("toTry", valvesToTry.length);

  const perms = getPermutations(graph["AA"], 30, valvesToTry);
  console.log("perms", perms.length);
  let bestRelief = 0;

  // perms.forEach((perm) => {
  //   let currentTunnel = graph["AA"];
  //   let time = 30;
  //   let curRelief = 0;
  //   perm.forEach((tunnel) => {
  //     time = time - currentTunnel.distanceGraph[tunnel.name].distance - 1;
  //     if (time <= 0) return;
  //     curRelief += time * tunnel.rate;
  //     currentTunnel = tunnel;
  //   });
  //   bestRelief = Math.max(bestRelief, curRelief);
  // });

  return bestRelief;
};

const getUltimateRelief = (input: string) => {
  const graph = getGraph(input);
  let relief = 0;
  let time = 30;
  let currentTunnel = graph["AA"];

  while (currentTunnel && time > 0) {
    const bestMove = getBestMove(graph, currentTunnel, time);
    console.log({ bestMove });
    relief += bestMove.relief;
    time = bestMove.time;
    currentTunnel = graph[bestMove.name];
    currentTunnel ? (currentTunnel.isOpen = true) : null;
  }

  return relief;
};

export const loader = ({ request }: LoaderArgs) => {
  console.log("Part I");
  console.log(getUltimateRelief(testInput));
  // console.table(graph);

  // console.log(graph["AA"]);
  console.log(getUltimateRelief(realInput));

  console.log("allOrders test");
  console.log("best", tryAllOrders(testInput));
  console.log("allOrders real");
  console.log(tryAllOrders(realInput));

  // console.log("trees...");
  // console.log(treeSearchIt(testInput));
  // console.log(treeSearchIt(realInput));

  console.log("Part II");

  return json({
    test: "test",
    real: "real",
  });
};

export default function ProboscideaVolcanium() {
  const { real, test } = useLoaderData();

  return (
    <div>
      <div>Test: {test}</div>
      <div>Real: {real}</div>
    </div>
  );
}
