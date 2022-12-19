import { useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/node";
import { input, testInput } from "~/routes/__index/10/input";

const getSignalStrengths = (signal: string) => {
  const targetCycles = [220, 180, 140, 100, 60, 20];
  const commands = signal.split("\n");

  let sum = 0;
  let cycle = 0;
  let x = 1;
  let currentCycleTarget = targetCycles.pop();
  commands.forEach((command) => {
    let addVal = 0;
    if (command === "noop") {
      cycle++;
    } else {
      cycle += 2;
      const [_, val] = command.split(" ");
      addVal = +val;
    }
    if (cycle >= (currentCycleTarget ?? 0)) {
      sum += (currentCycleTarget ?? 0) * x;
      currentCycleTarget = targetCycles.pop();
    }
    x += addVal;
  });

  return sum;
};

const getScreenContent = (signal: string) => {
  const commands = signal.split("\n");

  let output = "";
  let currentCommand = commands.shift();
  let currentState = "addx";
  let spritePosition = 1;
  for (let cycle = 1; cycle < 240; cycle++) {
    const position = (cycle - 1) % 40;
    output +=
      spritePosition - 1 <= position && position <= spritePosition + 1
        ? "#"
        : ".";
    if (cycle % 40 === 0) {
      output += "\n";
    }
    if (currentCommand === "noop") {
      currentCommand = commands.shift();
    } else if (currentState === "addx") {
      currentState = "addx2";
    } else {
      const [_, val] = currentCommand!.split(" ");
      spritePosition += +val;
      currentState = "addx";
      currentCommand = commands.shift();
    }
  }

  return output;
};

export const loader = ({ request }: LoaderArgs) => {
  return json({
    test: getSignalStrengths(testInput),
    real: getSignalStrengths(input),
    testOutput: getScreenContent(testInput),
    realOutput: getScreenContent(input),
  });
};
export default function CathodeRayTube() {
  const { real, test, testOutput, realOutput } = useLoaderData();

  return (
    <div>
      <div>Test: {test}</div>
      <div>Real: {real}</div>
      <div className="mt-5">Test Screen</div>
      <pre>
        <code>{testOutput}</code>
      </pre>
      <div className="mt-5">Real Screen</div>
      <pre>
        <code>{realOutput}</code>
      </pre>
    </div>
  );
}
