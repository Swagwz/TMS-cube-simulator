import { afterEach, describe, expect, it, vi } from "vitest";
import { FixedRNG } from "@/domains/random/fixedRng";
import { PotManager } from "@/domains/potential/potManager";
import type { CubeDefinition } from "./cube.type";
import {
  applyLineEffect,
  replaceFixedPotentialLine,
  rollCombineCube,
  rollCombinePotentialLine,
  rollCombineSelectedLine,
  rollDirectCube,
  rollHexaCube,
  rollRestoreCube,
  validatePotentialLinesByType,
} from "./cubeRoll.feature";

const baseCube: CubeDefinition = {
  id: "craftsmanCube",
  name: "test cube",
  description: "test cube",
  price: 0,
  discount: 0,
  imagePath: "",
  apply: "mainPot",
  workflow: "direct",
  rankUpType: "none",
  validationType: "standard",
  lineEffect: { type: "none" },
  rankUp: null,
  lineRank: {
    rare: [
      [100, 0],
      [100, 0],
      [100, 0],
    ],
    epic: [
      [100, 0],
      [100, 0],
      [100, 0],
    ],
  },
};

const pools = {
  normal: [{ id: "normal-1", weight: 1 }],
  rare: [{ id: "rare-1", weight: 1 }],
  epic: [{ id: "epic-1", weight: 1 }],
  unique: [{ id: "unique-1", weight: 1 }],
  legendary: [{ id: "legendary-1", weight: 1 }],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("rollDirectCube", () => {
  it("uses standard rank-up with injected rng", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const cube: CubeDefinition = {
      ...baseCube,
      rankUpType: "standard",
      rankUp: { rare: [100] },
    };

    const output = rollDirectCube({
      cube,
      current: {
        tier: "rare",
        potentialIds: ["before-1", "before-2", "before-3"],
      },
      pools,
      rng: new FixedRNG([0.99, 0, 0, 0, 0, 0, 0]),
    });

    expect(output).toEqual({
      flow: "direct",
      rolled: {
        tier: "epic",
        potentialIds: ["epic-1", "epic-1", "epic-1"],
      },
    });
  });

  it("keeps current tier when rankUpType is none", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);

    const output = rollDirectCube({
      cube: baseCube,
      current: {
        tier: "rare",
        potentialIds: ["before-1", "before-2", "before-3"],
      },
      pools,
      rng: new FixedRNG([0, 0, 0, 0, 0, 0]),
    });

    expect(output.rolled.tier).toBe("rare");
  });

  it("requires accumulateCount for accumulate rank-up", () => {
    const cube: CubeDefinition = {
      ...baseCube,
      id: "shinyAdditionalCube",
      apply: "additionalPot",
      rankUpType: "accumulate",
      rankUp: { rare: [4.7] },
      rankUpIncr: {
        rare: 0.05,
        epic: 0.01,
        unique: 0.005,
      },
      ceiling: {
        rare: 44,
        epic: 109,
        unique: 307,
      },
    };

    expect(() =>
      rollDirectCube({
        cube,
        current: {
          tier: "rare",
          potentialIds: ["before-1", "before-2", "before-3"],
        },
        pools,
        rng: new FixedRNG([0]),
      }),
    ).toThrow("accumulateCount is required for accumulate rank-up");
  });
});

describe("line effect and validation policies", () => {
  it("copies the source line to the target line for mirror effect", () => {
    const cube: CubeDefinition = {
      ...baseCube,
      id: "mirrorCube",
      validationType: "none",
      lineEffect: {
        type: "mirror",
        probability: 20,
        fromIndex: 0,
        toIndex: 1,
      },
    };

    expect(
      applyLineEffect({
        cube,
        potentialIds: ["line-1", "line-2", "line-3"],
        rng: new FixedRNG([0]),
      }),
    ).toEqual(["line-1", "line-1", "line-3"]);
  });

  it("skips potential line validation when validationType is none", () => {
    const validateSpy = vi
      .spyOn(PotManager, "validateLineRules")
      .mockReturnValue(false);
    const cube: CubeDefinition = {
      ...baseCube,
      validationType: "none",
    };

    expect(validatePotentialLinesByType(cube, ["invalid"])).toBe(true);
    expect(validateSpy).not.toHaveBeenCalled();
  });
});

describe("rollRestoreCube", () => {
  it("replaces the fixed line after rolling and validates the final result", () => {
    const validateSpy = vi
      .spyOn(PotManager, "validateLineRules")
      .mockReturnValue(true);
    const output = rollRestoreCube({
      cube: { ...baseCube, workflow: "restore" },
      current: {
        tier: "rare",
        potentialIds: ["original-1", "original-2", "original-3"],
      },
      pools,
      fixedIndex: 1,
      canFixLine: true,
      rng: new FixedRNG([0, 0, 0, 0, 0, 0]),
    });

    expect(output.after.potentialIds).toEqual([
      "rare-1",
      "original-2",
      "rare-1",
    ]);
    expect(validateSpy).toHaveBeenCalledWith([
      "rare-1",
      "original-2",
      "rare-1",
    ]);
  });

  it("does not replace a line when fixedIndex is negative", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const output = rollRestoreCube({
      cube: { ...baseCube, workflow: "restore" },
      current: {
        tier: "rare",
        potentialIds: ["original-1", "original-2", "original-3"],
      },
      pools,
      fixedIndex: -1,
      canFixLine: true,
      rng: new FixedRNG([0, 0, 0, 0, 0, 0]),
    });

    expect(output.after.potentialIds).toEqual(["rare-1", "rare-1", "rare-1"]);
  });

  it("ignores fixed replacement when the cube has no fixed companion", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const output = rollRestoreCube({
      cube: { ...baseCube, workflow: "restore" },
      current: {
        tier: "rare",
        potentialIds: ["original-1", "original-2", "original-3"],
      },
      pools,
      fixedIndex: 1,
      canFixLine: false,
      rng: new FixedRNG([0, 0, 0, 0, 0, 0]),
    });

    expect(output.after.potentialIds).toEqual(["rare-1", "rare-1", "rare-1"]);
  });
});

describe("rollHexaCube", () => {
  const hexaCube: CubeDefinition = {
    ...baseCube,
    id: "hexaCube",
    workflow: "hexa",
    rankUpType: "standard",
    rankUp: { rare: [100] },
    lineRank: {
      rare: [
        [100, 0],
        [100, 0],
        [100, 0],
        [100, 0],
        [100, 0],
        [100, 0],
      ],
      epic: [
        [100, 0],
        [100, 0],
        [100, 0],
        [100, 0],
        [100, 0],
        [100, 0],
      ],
    },
  };

  it("returns six candidate lines", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const output = rollHexaCube({
      cube: hexaCube,
      current: {
        tier: "rare",
        potentialIds: ["before-1", "before-2", "before-3"],
      },
      pools,
      rng: new FixedRNG([0.99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    });

    expect(output).toEqual({
      flow: "hexa",
      candidates: {
        tier: "epic",
        potentialIds: [
          "epic-1",
          "epic-1",
          "epic-1",
          "epic-1",
          "epic-1",
          "epic-1",
        ],
      },
    });
  });

  it("uses rank-up multiplier through standard rank-up policy", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const output = rollHexaCube({
      cube: { ...hexaCube, rankUp: { rare: [50] } },
      current: {
        tier: "rare",
        potentialIds: ["before-1", "before-2", "before-3"],
      },
      pools,
      rankUpMultiplier: 2,
      rng: new FixedRNG([0.99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    });

    expect(output.candidates.tier).toBe("epic");
  });

  it("validates the full six-line candidate set", () => {
    const validateSpy = vi
      .spyOn(PotManager, "validateLineRules")
      .mockReturnValueOnce(false)
      .mockReturnValue(true);

    rollHexaCube({
      cube: hexaCube,
      current: {
        tier: "rare",
        potentialIds: ["before-1", "before-2", "before-3"],
      },
      pools,
      rng: new FixedRNG([
        0.99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
    });

    expect(validateSpy).toHaveBeenCalledWith([
      "epic-1",
      "epic-1",
      "epic-1",
      "epic-1",
      "epic-1",
      "epic-1",
    ]);
    expect(validateSpy.mock.calls[0]?.[0]).toHaveLength(6);
  });
});

describe("rollCombineCube", () => {
  const combineCube: CubeDefinition = {
    ...baseCube,
    id: "combineCube",
    workflow: "combine",
    rankUpType: "none",
    rankUp: null,
  };
  const combinePools = {
    ...pools,
    rare: [
      { id: "rare-1", weight: 1 },
      { id: "rare-2", weight: 1 },
    ],
  };

  it("rolls the selected line deterministically", () => {
    expect(rollCombineSelectedLine({ rng: new FixedRNG([0]) })).toBe(0);
    expect(rollCombineSelectedLine({ rng: new FixedRNG([0.4]) })).toBe(1);
    expect(rollCombineSelectedLine({ rng: new FixedRNG([0.8]) })).toBe(2);
  });

  it("rerolls only the selected line and preserves other lines", () => {
    const validateSpy = vi
      .spyOn(PotManager, "validateLineRules")
      .mockReturnValue(true);
    const output = rollCombinePotentialLine({
      cube: combineCube,
      current: {
        tier: "rare",
        potentialIds: ["original-0", "original-1", "original-2"],
      },
      pools: combinePools,
      selectedIndex: 1,
      rng: new FixedRNG([0, 0]),
    });

    expect(output).toBe("rare-1");
    expect(validateSpy).toHaveBeenCalledWith([
      "original-0",
      "rare-1",
      "original-2",
    ]);
  });

  it("rerolls the selected line until the full result is valid", () => {
    const validateSpy = vi
      .spyOn(PotManager, "validateLineRules")
      .mockReturnValueOnce(false)
      .mockReturnValue(true);
    const output = rollCombinePotentialLine({
      cube: combineCube,
      current: {
        tier: "rare",
        potentialIds: ["original-0", "original-1", "original-2"],
      },
      pools: combinePools,
      selectedIndex: 1,
      rng: new FixedRNG([0, 0, 0, 0.8]),
    });

    expect(output).toBe("rare-2");
    expect(validateSpy).toHaveBeenCalledTimes(2);
    expect(validateSpy.mock.calls[1]?.[0]).toEqual([
      "original-0",
      "rare-2",
      "original-2",
    ]);
  });

  it("uses normal random selection when targetIndex is negative", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const result = rollCombineCube({
      cube: combineCube,
      current: {
        tier: "rare",
        potentialIds: ["original-0", "original-1", "original-2"],
      },
      pools: combinePools,
      targetIndex: -1,
      rng: new FixedRNG([0.4, 0, 0]),
    });

    expect(result).toEqual({
      output: {
        flow: "combine",
        step: "rolledLine",
        selectedIndex: 1,
        rolledPotentialId: "rare-1",
      },
      attempts: 1,
    });
  });

  it("loops until targetIndex is selected and reports attempts", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const result = rollCombineCube({
      cube: combineCube,
      current: {
        tier: "rare",
        potentialIds: ["original-0", "original-1", "original-2"],
      },
      pools: combinePools,
      targetIndex: 2,
      rng: new FixedRNG([0, 0.4, 0.8, 0, 0]),
    });

    expect(result.output.selectedIndex).toBe(2);
    expect(result.attempts).toBe(3);
  });

  it("throws when selectedIndex is invalid", () => {
    expect(() =>
      rollCombinePotentialLine({
        cube: combineCube,
        current: {
          tier: "rare",
          potentialIds: ["original-0", "original-1", "original-2"],
        },
        pools: combinePools,
        selectedIndex: 3,
        rng: new FixedRNG([0]),
      }),
    ).toThrow("selectedIndex must be a line index between 0 and 2");
  });

  it("throws when targetIndex is invalid", () => {
    expect(() =>
      rollCombineCube({
        cube: combineCube,
        current: {
          tier: "rare",
          potentialIds: ["original-0", "original-1", "original-2"],
        },
        pools: combinePools,
        targetIndex: 3,
        rng: new FixedRNG([0]),
      }),
    ).toThrow("targetIndex must be -1 or a line index between 0 and 2");
  });
});

describe("replaceFixedPotentialLine", () => {
  it("replaces the selected rolled line with the original line", () => {
    const result = replaceFixedPotentialLine({
      rolledPotentialIds: ["rolled-1", "rolled-2", "rolled-3"],
      originalPotentialIds: ["original-1", "original-2", "original-3"],
      fixedIndex: 1,
    });

    expect(result).toEqual(["rolled-1", "original-2", "rolled-3"]);
  });

  it("does not replace a line when fixedIndex is negative", () => {
    const rolledPotentialIds = ["rolled-1", "rolled-2", "rolled-3"];
    const result = replaceFixedPotentialLine({
      rolledPotentialIds,
      originalPotentialIds: ["original-1", "original-2", "original-3"],
      fixedIndex: -1,
    });

    expect(result).toEqual(rolledPotentialIds);
    expect(result).not.toBe(rolledPotentialIds);
  });

  it("throws when fixedIndex is outside line index range", () => {
    expect(() =>
      replaceFixedPotentialLine({
        rolledPotentialIds: ["rolled-1", "rolled-2", "rolled-3"],
        originalPotentialIds: ["original-1", "original-2", "original-3"],
        fixedIndex: 3,
      }),
    ).toThrow("fixedIndex must be -1 or a line index between 0 and 2");
  });

  it("throws when fixedIndex is not an integer", () => {
    expect(() =>
      replaceFixedPotentialLine({
        rolledPotentialIds: ["rolled-1", "rolled-2", "rolled-3"],
        originalPotentialIds: ["original-1", "original-2", "original-3"],
        fixedIndex: 1.5,
      }),
    ).toThrow("fixedIndex must be -1 or a line index between 0 and 2");
  });
});
