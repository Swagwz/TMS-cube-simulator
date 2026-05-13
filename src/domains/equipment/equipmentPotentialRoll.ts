import { PotManager } from "@/domains/potential/potManager";

export type PotentialPool = {
  prime: string[];
  nonPrime: string[];
};

type RollPotentialIdsParams = PotentialPool & {
  random?: () => number;
  attempts?: number;
};

const POTENTIAL_LINE_COUNT = 3;
const DEFAULT_ATTEMPTS = 100;

export function rollValidPotIds({
  prime,
  nonPrime,
  random = Math.random,
  attempts = DEFAULT_ATTEMPTS,
}: RollPotentialIdsParams) {
  const all = [...prime, ...nonPrime];

  if (all.length === 0) return [];

  for (let i = 0; i < attempts; i++) {
    const potIds = rollRawPotIds({ prime, all, random });
    if (PotManager.validateLineRules(potIds)) return potIds;
  }

  return (
    findFirstValidPotIds({ prime, all }) ?? rollRawPotIds({ prime, all, random })
  );
}

function rollRawPotIds({
  prime,
  all,
  random,
}: {
  prime: string[];
  all: string[];
  random: () => number;
}) {
  return Array.from({ length: POTENTIAL_LINE_COUNT }, (_, i) => {
    const list = i === 0 && prime.length > 0 ? prime : all;
    const randomIndex = Math.floor(random() * list.length);
    return list[randomIndex]!;
  });
}

function findFirstValidPotIds({
  prime,
  all,
}: {
  prime: string[];
  all: string[];
}) {
  const lineOptions = Array.from({ length: POTENTIAL_LINE_COUNT }, (_, i) =>
    i === 0 && prime.length > 0 ? prime : all,
  );

  return searchValidPotIds(lineOptions, []);
}

function searchValidPotIds(
  lineOptions: string[][],
  potIds: string[],
): string[] | null {
  if (!PotManager.validateLineRules(potIds)) return null;

  if (potIds.length === lineOptions.length) {
    return potIds;
  }

  const nextOptions = lineOptions[potIds.length] ?? [];

  for (const id of nextOptions) {
    const result = searchValidPotIds(lineOptions, [...potIds, id]);
    if (result) return result;
  }

  return null;
}
