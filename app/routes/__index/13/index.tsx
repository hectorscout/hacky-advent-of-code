import { useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/node";
import { realInput, testInput } from "~/routes/__index/13/input";

const getSignalPairs = (input: string) => {
  const lines = input.split("\n");
  const { pairs } = lines.reduce(
    (accum, line, i) => {
      if (i % 3 === 0) {
        // eslint-disable-next-line no-eval
        accum.currentPair = [eval(line)];
      } else if (i % 3 === 1) {
        // eslint-disable-next-line no-eval
        accum.currentPair.push(eval(line));
        accum.pairs.push(accum.currentPair);
      }
      return accum;
    },
    { pairs: [], currentPair: [] } as { pairs: any[][]; currentPair: any[] }
  );

  return pairs;
};

const getAllSignals = (input: string): any[][] => {
  return input
    .split("\n")
    .filter((line) => line)
    .map((line) => eval(line));
};

const signalCmp = (left: any[], right: any[]): number => {
  // console.log(left, right);
  if (typeof left === "undefined") {
    // console.log("left undefined");
    return -1;
  }
  if (typeof right === "undefined") {
    // console.log("right undefined");
    return 1;
  }

  for (let i = 0; i < left.length; i++) {
    // console.log("for loop, ", left[i], right[i]);
    if (typeof left[i] === "number" && typeof right[i] === "number") {
      if (left[i] > right[i]) {
        // console.log("left greater than right");
        return 1;
      }
      if (left[i] < right[i]) {
        // console.log("right greater than left");
        return -1;
      }
    } else {
      const leftArray = typeof left[i] === "number" ? [left[i]] : left[i];
      const rightArray = typeof right[i] === "number" ? [right[i]] : right[i];

      const subIsCorrect = signalCmp(leftArray, rightArray);
      if (subIsCorrect) {
        // console.log("recursive return", subIsCorrect);
        return subIsCorrect;
      }
    }
  }
  if (left.length < right.length) return -1;
  // console.log("unknown");
  return 0;
};

const getCorrectIndexSum = (input: string) => {
  const signalPairs = getSignalPairs(input);
  // console.log(signalPairs);

  // console.log(isCorrect(signalPairs[3]));
  // return [];

  const indexes = signalPairs.reduce((correctIndexes, pair, i) => {
    if (signalCmp(pair[0], pair[1]) === -1) {
      correctIndexes.push(i + 1);
    }
    return correctIndexes;
  }, [] as number[]);

  return indexes;
};

const sortSignals = (input: string) => {
  const signals = getAllSignals(input);
  signals.push([2]);
  signals.push([6]);
  signals.sort(signalCmp);
  console.log(signals);
  const twoIndex =
    signals.findIndex((signal) => signal[0] === 2 && signal.length === 1) + 1;
  const sixIndex =
    signals.findIndex((signal) => signal[0] === 6 && signal.length === 1) + 1;
  return twoIndex * sixIndex;
};
const sum = (numbers: number[]) => {
  return numbers.reduce((accum, val) => accum + val, 0);
};

export const loader = ({ request }: LoaderArgs) => {
  console.log("Part I");
  const testIndexes = getCorrectIndexSum(testInput);
  const realIndexes = getCorrectIndexSum(realInput);

  console.log("test", testIndexes, sum(testIndexes));
  console.log("real", realIndexes, sum(realIndexes));

  console.log("Part II");
  console.log(sortSignals(testInput));
  console.log(sortSignals(realInput));

  return json({
    test: "test",
    real: "real",
  });
};

export default function DistressSignal() {
  const { real, test } = useLoaderData();

  return (
    <div>
      <div>Test: {test}</div>
      <div>Real: {real}</div>
    </div>
  );
}
