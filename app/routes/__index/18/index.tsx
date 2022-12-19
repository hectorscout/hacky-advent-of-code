import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { realInput, testInput, trivialInput } from "~/routes/__index/18/input";

type Cube = [number, number, number];

type Boundaries = {
  maxX: number;
  minX: number;
  maxY: number;
  minY: number;
  maxZ: number;
  minZ: number;
};

const getCubeKey = ([x, y, z]: Cube) => `${x},${y},${z}`;
const getCubeFromKey = (cubeKey: string): Cube => {
  return cubeKey.split(",").map((val) => +val) as Cube;
};

const getBoundaries = (cubes: Record<string, Cube>): Boundaries => {
  const boundaries = {
    maxX: 0,
    minX: Infinity,
    maxY: 0,
    minY: Infinity,
    maxZ: 0,
    minZ: Infinity,
  };

  for (const key in cubes) {
    const cube = cubes[key];
    boundaries.maxX = Math.max(boundaries.maxX, cube[0]);
    boundaries.minX = Math.min(boundaries.minX, cube[0]);
    boundaries.maxY = Math.max(boundaries.maxY, cube[1]);
    boundaries.minY = Math.min(boundaries.minY, cube[1]);
    boundaries.maxZ = Math.max(boundaries.maxZ, cube[2]);
    boundaries.minZ = Math.min(boundaries.minZ, cube[2]);
  }
  return boundaries;
};

const getSuroundingCubeKeys = ([x, y, z]: Cube) => {
  return [
    `${x + 1},${y},${z}`,
    `${x - 1},${y},${z}`,
    `${x},${y + 1},${z}`,
    `${x},${y - 1},${z}`,
    `${x},${y},${z + 1}`,
    `${x},${y},${z - 1}`,
  ];
};

const getBubble = (boundaries: Boundaries) => {
  const surfaceAir: Set<string> = new Set();
  for (let x = boundaries.maxX + 1; x >= boundaries.minX - 1; x--) {
    for (let y = boundaries.maxY + 1; y >= boundaries.minY - 1; y--) {
      surfaceAir.add(getCubeKey([x, y, boundaries.minZ - 1]));
    }
  }
  for (let x = boundaries.maxX + 1; x >= boundaries.minX - 1; x--) {
    for (let y = boundaries.maxY + 1; y >= boundaries.minY - 1; y--) {
      surfaceAir.add(getCubeKey([x, y, boundaries.maxZ + 1]));
    }
  }
  for (let x = boundaries.maxX + 1; x >= boundaries.minX - 1; x--) {
    for (let z = boundaries.maxZ + 1; z >= boundaries.minZ - 1; z--) {
      surfaceAir.add(getCubeKey([x, boundaries.minY - 1, z]));
    }
  }
  for (let x = boundaries.maxX + 1; x >= boundaries.minX - 1; x--) {
    for (let z = boundaries.maxZ + 1; z >= boundaries.minZ - 1; z--) {
      surfaceAir.add(getCubeKey([x, boundaries.maxY + 1, z]));
    }
  }
  for (let y = boundaries.maxY + 1; y >= boundaries.minY - 1; y--) {
    for (let z = boundaries.maxZ + 1; z >= boundaries.minZ - 1; z--) {
      surfaceAir.add(getCubeKey([boundaries.minX - 1, y, z]));
    }
  }
  for (let y = boundaries.maxY + 1; y >= boundaries.minY - 1; y--) {
    for (let z = boundaries.maxZ + 1; z >= boundaries.minZ - 1; z--) {
      surfaceAir.add(getCubeKey([boundaries.maxX + 1, y, z]));
    }
  }
  return surfaceAir;
};

const populateAirForCube = (
  cubes: Record<string, Cube>,
  boundaries: Boundaries,
  [x, y, z]: Cube,
  surfaceAir: Set<string>
) => {
  if (cubes[getCubeKey([x, y, z])]) {
    // if it's a cube it ain't surfaceAir...
  } else if (
    [boundaries.minX, boundaries.maxX].includes(x) ||
    [boundaries.minY, boundaries.maxY].includes(y) ||
    [boundaries.minZ, boundaries.maxZ].includes(z)
  ) {
    surfaceAir.add(getCubeKey([x, y, z]));
  } else {
    // console.log("in else");
    const surroundingKeys = getSuroundingCubeKeys([x, y, z]);
    // console.log(surroundingKeys);
    for (const i in surroundingKeys) {
      if (surfaceAir.has(surroundingKeys[i])) {
        surfaceAir.add(getCubeKey([x, y, z]));
      }
    }
  }
};

const populateSurfaceAir = (cubes: Record<string, Cube>) => {
  const boundaries = getBoundaries(cubes);
  console.log(boundaries);

  const surfaceAir: Set<string> = getBubble(boundaries);

  // 111
  for (let x = boundaries.maxX; x >= boundaries.minX; x--) {
    for (let y = boundaries.maxY; y >= boundaries.minY; y--) {
      for (let z = boundaries.maxZ; z >= boundaries.minZ; z--) {
        populateAirForCube(cubes, boundaries, [x, y, z], surfaceAir);
      }
    }
  }
  // 110;
  for (let x = boundaries.maxX; x >= boundaries.minX; x--) {
    for (let y = boundaries.maxY; y >= boundaries.minY; y--) {
      for (let z = boundaries.minZ; z <= boundaries.maxZ; z++) {
        populateAirForCube(cubes, boundaries, [x, y, z], surfaceAir);
      }
    }
  }
  // 101
  for (let x = boundaries.maxX; x >= boundaries.minX; x--) {
    for (let y = boundaries.minY; y <= boundaries.maxY; y++) {
      for (let z = boundaries.maxZ; z >= boundaries.minZ; z--) {
        populateAirForCube(cubes, boundaries, [x, y, z], surfaceAir);
      }
    }
  }
  // 100
  for (let x = boundaries.maxX; x >= boundaries.minX; x--) {
    for (let y = boundaries.minY; y <= boundaries.maxY; y++) {
      for (let z = boundaries.minZ; z <= boundaries.maxZ; z++) {
        populateAirForCube(cubes, boundaries, [x, y, z], surfaceAir);
      }
    }
  }
  // 011
  for (let x = boundaries.minX; x <= boundaries.maxX; x++) {
    for (let y = boundaries.maxY; y >= boundaries.minY; y--) {
      for (let z = boundaries.maxZ; z >= boundaries.minZ; z--) {
        populateAirForCube(cubes, boundaries, [x, y, z], surfaceAir);
      }
    }
  }
  // 010
  for (let x = boundaries.minX; x <= boundaries.maxX; x++) {
    for (let y = boundaries.maxY; y >= boundaries.minY; y--) {
      for (let z = boundaries.minZ; z <= boundaries.maxZ; z++) {
        populateAirForCube(cubes, boundaries, [x, y, z], surfaceAir);
      }
    }
  }
  // 001
  for (let x = boundaries.minX; x <= boundaries.maxX; x++) {
    for (let y = boundaries.minY; y <= boundaries.maxY; y++) {
      for (let z = boundaries.maxZ; z >= boundaries.minZ; z--) {
        populateAirForCube(cubes, boundaries, [x, y, z], surfaceAir);
      }
    }
  }
  // 000
  for (let x = boundaries.minX; x <= boundaries.maxX; x++) {
    for (let y = boundaries.minY; y <= boundaries.maxY; y++) {
      for (let z = boundaries.minZ; z <= boundaries.maxZ; z++) {
        populateAirForCube(cubes, boundaries, [x, y, z], surfaceAir);
      }
    }
  }

  console.log("air size", surfaceAir.size);
  return surfaceAir;
};

const isSurfaceAir = (
  cubes: Record<string, Cube>,
  boundaries: Boundaries,
  cube: Cube,
  visited: Set<string>,
  surfaceAir: Set<string>
) => {
  const [x, y, z] = cube;
  if (cubes[getCubeKey(cube)]) return false;
  if (
    surfaceAir.has(getCubeKey(cube)) ||
    x >= boundaries.maxX ||
    x <= boundaries.minX ||
    y >= boundaries.maxY ||
    y <= boundaries.minY ||
    z >= boundaries.maxZ ||
    z <= boundaries.minZ
  ) {
    return true;
  }

  const surroundingCubeKeys = getSuroundingCubeKeys(cube);
  for (let i in surroundingCubeKeys) {
    const cubeKey = surroundingCubeKeys[i];
    if (!visited.has(cubeKey)) {
      if (
        isSurfaceAir(
          cubes,
          boundaries,
          getCubeFromKey(cubeKey),
          new Set([...visited, getCubeKey(cube)]),
          surfaceAir
        )
      ) {
        surfaceAir.add(getCubeKey(cube));
        return true;
      }
    }
  }
  return false;
};

const getCubeSurfaceArea = (cube: Cube, cubes: Record<string, Cube>) => {
  let surfaceArea = 0;
  getSuroundingCubeKeys(cube).forEach((cubeKey) => {
    surfaceArea += !cubes[cubeKey] ? 1 : 0;
  });
  return surfaceArea;
};

const getCubes = (input: string) => {
  const lines = input.split("\n");

  const cubes = lines.reduce((accum, line) => {
    accum[line] = getCubeFromKey(line);
    return accum;
  }, {} as Record<string, Cube>);

  return cubes;
};

const getSurfaceArea = (input: string) => {
  const cubes = getCubes(input);
  let surfaceArea = 0;

  for (const key in cubes) {
    surfaceArea += getCubeSurfaceArea(cubes[key], cubes);
  }

  return surfaceArea;
};

const getExternalCubeSurfaceArea = (
  cube: Cube,
  cubes: Record<string, Cube>,
  boundaries: Boundaries,
  surfaceAir: Set<string>
) => {
  let surfaceArea = 0;
  getSuroundingCubeKeys(cube).forEach((cubeKey) => {
    surfaceArea += isSurfaceAir(
      cubes,
      boundaries,
      getCubeFromKey(cubeKey),
      new Set([getCubeKey(cube)]),
      surfaceAir
    )
      ? 1
      : 0;
  });
  return surfaceArea;
};

const getExternalCubeSurfaceAreaWithSurfaceAir = (
  cube: Cube,
  surfaceArea: Set<string>
) => {
  let cubeSurfaceArea = 0;
  getSuroundingCubeKeys(cube).forEach((cubeKey) => {
    cubeSurfaceArea += surfaceArea.has(cubeKey) ? 1 : 0;
  });
  return cubeSurfaceArea;
};

const getExternalSurfaceAreaSmarter = (input: string) => {
  const cubes = getCubes(input);

  const surfaceAir = populateSurfaceAir(cubes);

  let surfaceArea = 0;

  for (const key in cubes) {
    surfaceArea += getExternalCubeSurfaceAreaWithSurfaceAir(
      cubes[key],
      surfaceAir
    );
  }
  return surfaceArea;
};

const getExternalSurfaceArea = (input: string) => {
  const cubes = getCubes(input);
  const surfaceAir: Set<string> = new Set();
  const boundaries = getBoundaries(cubes);

  let surfaceArea = 0;

  for (const key in cubes) {
    surfaceArea += getExternalCubeSurfaceArea(
      cubes[key],
      cubes,
      boundaries,
      surfaceAir
    );
  }

  return surfaceArea;
};

export const loader = ({ request }: LoaderArgs) => {
  console.log("************************ Part I");
  console.log("trivial", getSurfaceArea(trivialInput));
  console.log("test", getSurfaceArea(testInput));
  console.log("real", getSurfaceArea(realInput));

  console.log("***********************  Part II");
  console.log("trivial", getExternalSurfaceArea(trivialInput));
  console.log("test", getExternalSurfaceArea(testInput));
  console.log("trivial smarter", getExternalSurfaceAreaSmarter(trivialInput));
  console.log("test smarter", getExternalSurfaceAreaSmarter(testInput));
  console.log(
    "real by populating surface air",
    getExternalSurfaceAreaSmarter(realInput)
  );

  // Don't, just don't
  // console.log("real", getExternalSurfaceArea(realInput)); // Don't do this...

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
