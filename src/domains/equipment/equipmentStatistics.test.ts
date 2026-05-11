import { describe, expect, it } from "vitest";
import { incrementStatisticsCount } from "./equipmentStatistics";

type TestWorking = {
  statistics: {
    counts: {
      mainPot: Partial<Record<string, number>>;
      additionalPot: Partial<Record<string, number>>;
      soul: Partial<Record<string, number>>;
    };
  };
};

function createWorking(): TestWorking {
  return {
    statistics: {
      counts: {
        mainPot: {},
        additionalPot: {},
        soul: {},
      },
    },
  };
}

describe("incrementStatisticsCount", () => {
  it("starts from zero when the count does not exist", () => {
    const working = createWorking();
    const next = incrementStatisticsCount(working, "mainPot", "craftsmanCube");

    expect(next.statistics.counts.mainPot.craftsmanCube).toBe(1);
  });

  it("adds delta to an existing count", () => {
    const working = createWorking();
    working.statistics.counts.mainPot.craftsmanCube = 2;

    const next = incrementStatisticsCount(
      working,
      "mainPot",
      "craftsmanCube",
      3,
    );

    expect(next.statistics.counts.mainPot.craftsmanCube).toBe(5);
  });

  it("updates only the requested feature and id", () => {
    const working = createWorking();
    working.statistics.counts.mainPot.craftsmanCube = 2;
    working.statistics.counts.soul.wuGongJewel = 4;

    const next = incrementStatisticsCount(working, "additionalPot", "cube-a");

    expect(next.statistics.counts.mainPot.craftsmanCube).toBe(2);
    expect(next.statistics.counts.soul.wuGongJewel).toBe(4);
    expect(next.statistics.counts.additionalPot["cube-a"]).toBe(1);
  });
});
