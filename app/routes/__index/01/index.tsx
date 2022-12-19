import type { LoaderArgs } from "@remix-run/node";
import { input, testInput } from "./input";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Highlight from "react-highlight";

// const code = `
const calculateCalorieCarriers = (loadInput: string) => {
  const { loads } = loadInput.split("\n").reduce(
    (loadAccum, parcel) => {
      if (parcel) {
        loadAccum.currentCalorieCount += +parcel;
      } else {
        loadAccum.loads.push(loadAccum.currentCalorieCount);
        loadAccum.currentCalorieCount = 0;
      }
      return loadAccum;
    },
    { loads: [] as number[], currentCalorieCount: 0 }
  );
  loads.sort((n1, n2) => n2 - n1);

  return loads;
};
// `;
//
// eval(code);

const code = `const calculateCalorieCarriers = (loadInput: string) => {
  const { loads } = loadInput.split("\\n").reduce(
    (loadAccum, parcel) => {
      if (parcel) {
        loadAccum.currentCalorieCount += +parcel;
      } else {
        loadAccum.loads.push(loadAccum.currentCalorieCount);
        loadAccum.currentCalorieCount = 0;
      }
      return loadAccum;
    },
    { loads: [] as number[], currentCalorieCount: 0 }
  );
  loads.sort((n1, n2) => n2 - n1);

  return loads;
};
`;
export const loader = ({ request }: LoaderArgs) => {
  return json({
    testLoads: calculateCalorieCarriers(testInput),
    realLoads: calculateCalorieCarriers(input),
  });
};

export default function CalorieCounting() {
  const { testLoads, realLoads } = useLoaderData();

  return (
    <div className="p-5">
      <div>
        Elves are carrying food and we want to know who is carrying the most
        calories.
      </div>
      <h2 className="mt-5 text-xl">Top test elves:</h2>
      <ol className="ml-10 list-decimal">
        <li>{testLoads[0]}</li>
        <li>{testLoads[1]}</li>
        <li>{testLoads[2]}</li>
      </ol>
      <div>Total: {testLoads[0] + testLoads[1] + testLoads[2]}</div>
      <div className="mt-5 text-xl">Top real elves:</div>
      <ol className="ml-10 list-decimal">
        <li>{realLoads[0]}</li>
        <li>{realLoads[1]}</li>
        <li>{realLoads[2]}</li>
      </ol>
      <div>Total: {realLoads[0] + realLoads[1] + realLoads[2]}</div>
      <div className="mt-10 mb-2 text-xl">Relevant Code</div>
      <pre className="bg-green-300 p-5">
        <code>{code}</code>
      </pre>
      <Highlight className="typescript">{code}</Highlight>
    </div>
  );
}
