export type Monkey = {
  prime: number;
  items: number[];
  getNewWorry: (old: number) => number;
  throwTo: (worry: number) => number;
  inspectCount: number;
};

export const testMonkeys: Monkey[] = [
  {
    prime: 23,
    items: [79, 98],
    getNewWorry: (old: number) => old * 19,
    throwTo: (worry: number) => (worry % 23 === 0 ? 2 : 3),
    inspectCount: 0,
  },
  {
    prime: 19,
    items: [54, 65, 75, 74],
    getNewWorry: (old: number) => old + 6,
    throwTo: (worry: number) => (worry % 19 === 0 ? 2 : 0),
    inspectCount: 0,
  },
  {
    prime: 13,
    items: [79, 60, 97],
    getNewWorry: (old: number) => old * old,
    throwTo: (worry: number) => (worry % 13 === 0 ? 1 : 3),
    inspectCount: 0,
  },
  {
    prime: 17,
    items: [74],
    getNewWorry: (old: number) => old + 3,
    throwTo: (worry: number) => (worry % 17 === 0 ? 0 : 1),
    inspectCount: 0,
  },
];
export const testInput = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

export const realMonkeys: Monkey[] = [
  {
    prime: 11,
    items: [56, 52, 58, 96, 70, 75, 72],
    getNewWorry: (old: number) => old * 17,
    throwTo: (worry: number) => (worry % 11 === 0 ? 2 : 3),
    inspectCount: 0,
  },
  {
    prime: 3,
    items: [75, 58, 86, 80, 55, 81],
    getNewWorry: (old: number) => old + 7,
    throwTo: (worry: number) => (worry % 3 === 0 ? 6 : 5),
    inspectCount: 0,
  },
  {
    prime: 5,
    items: [73, 68, 73, 90],
    getNewWorry: (old: number) => old * old,
    throwTo: (worry: number) => (worry % 5 === 0 ? 1 : 7),
    inspectCount: 0,
  },
  {
    prime: 7,
    items: [72, 89, 55, 51, 59],
    getNewWorry: (old: number) => old + 1,
    throwTo: (worry: number) => (worry % 7 === 0 ? 2 : 7),
    inspectCount: 0,
  },
  {
    prime: 19,
    items: [76, 76, 91],
    getNewWorry: (old: number) => old * 3,
    throwTo: (worry: number) => (worry % 19 === 0 ? 0 : 3),
    inspectCount: 0,
  },
  {
    prime: 2,
    items: [88],
    getNewWorry: (old: number) => old + 4,
    throwTo: (worry: number) => (worry % 2 === 0 ? 6 : 4),
    inspectCount: 0,
  },
  {
    prime: 13,
    items: [64, 63, 56, 50, 77, 55, 55, 86],
    getNewWorry: (old: number) => old + 8,
    throwTo: (worry: number) => (worry % 13 === 0 ? 4 : 0),
    inspectCount: 0,
  },
  {
    prime: 17,
    items: [79, 58],
    getNewWorry: (old: number) => old + 6,
    throwTo: (worry: number) => (worry % 17 === 0 ? 1 : 5),
    inspectCount: 0,
  },
];
export const input = `Monkey 0:
  Starting items: 56, 52, 58, 96, 70, 75, 72
  Operation: new = old * 17
  Test: divisible by 11
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 75, 58, 86, 80, 55, 81
  Operation: new = old + 7
  Test: divisible by 3
    If true: throw to monkey 6
    If false: throw to monkey 5

Monkey 2:
  Starting items: 73, 68, 73, 90
  Operation: new = old * old
  Test: divisible by 5
    If true: throw to monkey 1
    If false: throw to monkey 7

Monkey 3:
  Starting items: 72, 89, 55, 51, 59
  Operation: new = old + 1
  Test: divisible by 7
    If true: throw to monkey 2
    If false: throw to monkey 7

Monkey 4:
  Starting items: 76, 76, 91
  Operation: new = old * 3
  Test: divisible by 19
    If true: throw to monkey 0
    If false: throw to monkey 3

Monkey 5:
  Starting items: 88
  Operation: new = old + 4
  Test: divisible by 2
    If true: throw to monkey 6
    If false: throw to monkey 4

Monkey 6:
  Starting items: 64, 63, 56, 50, 77, 55, 55, 86
  Operation: new = old + 8
  Test: divisible by 13
    If true: throw to monkey 4
    If false: throw to monkey 0

Monkey 7:
  Starting items: 79, 58
  Operation: new = old + 6
  Test: divisible by 17
    If true: throw to monkey 1
    If false: throw to monkey 5`;
