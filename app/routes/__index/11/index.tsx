import { useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/node";
import type { Monkey } from "~/routes/__index/11/input";
import { realMonkeys, testMonkeys } from "~/routes/__index/11/input";

const haveARound = (monkeys: Monkey[], lcm: number) => {
  monkeys.forEach((monkey) => {
    while (monkey.items.length) {
      const item = monkey.items.shift()!;
      const newItemVal = monkey.getNewWorry(item) % lcm; // / 3);
      monkeys[monkey.throwTo(newItemVal)].items.push(newItemVal);
      monkey.inspectCount++;
    }
  });
};

const getModuloBase = (monkeys: Monkey[]) => {
  return monkeys.reduce((base, monkey) => monkey.prime * base, 1);
};
export const loader = ({ request }: LoaderArgs) => {
  const testModuloBase = getModuloBase(testMonkeys);
  const realModuloBase = getModuloBase(realMonkeys);
  for (let i = 0; i < 10000; i++) {
    haveARound(testMonkeys, testModuloBase);
    haveARound(realMonkeys, realModuloBase);
  }

  testMonkeys.sort((a, b) => b.inspectCount - a.inspectCount);
  realMonkeys.sort((a, b) => b.inspectCount - a.inspectCount);
  console.log(testMonkeys);
  console.log(realMonkeys);

  return json({
    test: testMonkeys[0].inspectCount * testMonkeys[1].inspectCount,
    real: realMonkeys[0].inspectCount * realMonkeys[1].inspectCount,
  });
};

export default function MonkeyBusiness() {
  const { real, test } = useLoaderData();

  return (
    <div>
      <div>Test: {test}</div>
      <div>Real: {real}</div>
    </div>
  );
}
