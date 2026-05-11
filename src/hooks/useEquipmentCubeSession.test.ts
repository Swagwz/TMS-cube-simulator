import { describe, expect, it, vi } from "vitest";
import { FixedRNG } from "@/domains/random/fixedRng";
import { PotManager } from "@/domains/potential/potManager";
import type {
  CubeRollOutput,
  CubeSession,
  CubeSessionEquipment,
} from "@/domains/enhancement/cube/cubeSession.type";
import { runCombineRollAndApply } from "./useEquipmentCubeSession";

type TestEquipment = CubeSessionEquipment & {
  id: string;
};

function createEquipment(): TestEquipment {
  return {
    id: "equipment-1",
    subcategory: "primary-weapon",
    level: 200,
    mainPot: {
      tier: "rare",
      potentialIds: ["main-before-1", "main-before-2", "main-before-3"],
    },
    additionalPot: {
      tier: "rare",
      potentialIds: ["add-before-1", "add-before-2", "add-before-3"],
    },
    statistics: {
      counts: {
        mainPot: {},
        additionalPot: {},
      },
    },
  };
}

function createSession(params?: {
  working?: TestEquipment;
  pendingRoll?: CubeRollOutput | null;
  rng?: CubeSession<TestEquipment>["rng"];
}): CubeSession<TestEquipment> {
  const working = params?.working ?? createEquipment();

  return {
    system: "cube",
    cubeId: "combineCube",
    base: createEquipment(),
    working,
    rng: params?.rng ?? new FixedRNG([0, 0, 0]),
    pendingRoll: params?.pendingRoll ?? null,
  };
}

describe("runCombineRollAndApply", () => {
  it("directly applies the rolled line for a valid target index", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const result = runCombineRollAndApply(
      createSession({
        rng: new FixedRNG([0.4, 0.4, 0]),
      }),
      1,
    );

    expect(result.session.pendingRoll).toBeNull();
    expect(result.session.working.mainPot.potentialIds[1]).not.toBe(
      "main-before-2",
    );
    expect(result.session.working.mainPot.potentialIds[0]).toBe("main-before-1");
    expect(result.session.working.mainPot.potentialIds[2]).toBe("main-before-3");
    expect(result.session.working.statistics.counts.mainPot.combineCube).toBe(1);
  });

  it("counts target-mode slot-roll attempts through the roll side effect only", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const result = runCombineRollAndApply(
      createSession({
        rng: new FixedRNG([0, 0.4, 0.8, 0]),
      }),
      2,
    );

    expect(result.session.pendingRoll).toBeNull();
    expect(result.session.working.statistics.counts.mainPot.combineCube).toBe(3);
  });

  it("throws for an invalid target index", () => {
    expect(() => runCombineRollAndApply(createSession(), 3)).toThrow(
      "targetIndex must be -1 or a line index between 0 and 2",
    );
  });
});
