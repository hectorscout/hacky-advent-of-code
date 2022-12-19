import { json, LoaderArgs } from "@remix-run/node";
import { input, testInput } from "~/routes/__index/07/input";
import { useLoaderData } from "@remix-run/react";

const dirSizes: Record<string, number> = {};

const getDirectorySize = (
  directories: Record<string, Record<string, string>>,
  targetDir: string
) => {
  let size = 0;
  const directory = directories[targetDir];
  for (const key in directory) {
    if (directory[key] === "dir") {
      size += getDirectorySize(directories, key);
    } else {
      size += +directory[key];
    }
  }
  return size;
};

const getTargetDirectoriesSize = (
  directories: Record<string, Record<string, string>>
) => {
  let sum = 0;
  let best = { dir: "fake", size: 99999999999999999999999999 };
  const avail = 70000000 - getDirectorySize(directories, "/");
  const needed = 30000000 - avail;

  for (const key in directories) {
    const size = getDirectorySize(directories, key);
    if (size >= needed && size < best.size) {
      best = { dir: key, size };
    }
    if (size <= 100000) {
      sum += size;
    }
  }
  console.log({ best });
  console.log(sum);
  return sum;
};

const getDirectories = (commandInput: string) => {
  const commands = commandInput.split("\n");

  const directories: Record<string, Record<string, string>> = {};
  let currentPath: string[] = ["/"];

  const handleChangeDir = (dir: string) => {
    switch (dir) {
      case "/":
        currentPath = ["/"];
        break;
      case "..":
        currentPath.pop();
        break;
      default:
        currentPath.push(dir);
    }
  };

  commands.forEach((command) => {
    const commandMatch = command.match(/^\$ ([a-z]*) ?([a-z,A-Z,//,.]*)?/);
    if (commandMatch) {
      switch (commandMatch[1]) {
        case "cd":
          // handle change dir
          handleChangeDir(commandMatch[2]);
        case "ls":
        // eat list
      }
    } else {
      const currentDirectory = currentPath.join(",");
      if (!directories[currentDirectory]) {
        directories[currentDirectory] = {};
      }
      const [first, name] = command.split(" ");
      if (first === "dir") {
        directories[currentDirectory][`${currentDirectory},${name}`] = first;
      } else {
        directories[currentDirectory][name] = first;
      }
    }
  });

  return directories;
};
export const loader = ({ request }: LoaderArgs) => {
  return json({
    test: getTargetDirectoriesSize(getDirectories(testInput)),
    real: getTargetDirectoriesSize(getDirectories(input)),
  });
};
export default function NoSpaceLeftOnDevice() {
  const { real, test } = useLoaderData();
  return <div>Real: {real}</div>;
}
