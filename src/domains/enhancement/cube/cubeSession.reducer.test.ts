import { afterEach, describe, expect, it, vi } from "vitest";
import { FixedRNG } from "@/domains/random/fixedRng";
import { SeededRNG } from "@/domains/random/seededRng";
import { PotManager } from "@/domains/potential/potManager";
import { reduceCubeSession } from "./cubeSession.reducer";
import type { CubeId } from "./cube.type";
import type {
  CubeRollOutput,
  CubeSession,
  CubeSessionEquipment,
} from "./cubeSession.type";

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
      potIds: ["main-before-1", "main-before-2", "main-before-3"],
    },
    additionalPot: {
      tier: "rare",
      potIds: ["add-before-1", "add-before-2", "add-before-3"],
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
  cubeId?: CubeId;
  working?: TestEquipment;
  pendingRoll?: CubeRollOutput | null;
  rng?: CubeSession<TestEquipment>["rng"];
}): CubeSession<TestEquipment> {
  const working = params?.working ?? createEquipment();

  return {
    system: "cube",
    cubeId: params?.cubeId ?? "craftsmanCube",
    base: createEquipment(),
    working,
    rng: params?.rng ?? new SeededRNG(1),
    pendingRoll: params?.pendingRoll ?? null,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("reduceCubeSession", () => {
  it("creates a direct pending roll and increments cube count", () => {
    const session = createSession();
    const result = reduceCubeSession(session, {
      type: "roll",
      input: { flow: "direct" },
    });

    expect(result.session.working).not.toBe(session.working);
    expect(result.session.working.mainPot).toBe(session.working.mainPot);
    expect(result.session.pendingRoll?.flow).toBe("direct");
    expect(result.session.working.statistics.counts.mainPot.craftsmanCube).toBe(
      1,
    );
    expect(result.event?.type).toBe("rolled");
  });

  it("applies a direct main potential roll without incrementing again", () => {
    const pendingRoll: CubeRollOutput = {
      flow: "direct",
      rolled: {
        tier: "epic",
        potentialIds: ["main-after-1", "main-after-2", "main-after-3"],
      },
    };
    const working = createEquipment();
    working.statistics.counts.mainPot.craftsmanCube = 1;
    const session = createSession({
      cubeId: "craftsmanCube",
      working,
      pendingRoll,
    });
    const result = reduceCubeSession(session, { type: "apply" });

    expect(result.session.working.mainPot).toEqual({
      tier: "epic",
      potIds: ["main-after-1", "main-after-2", "main-after-3"],
    });
    expect(result.session.working.additionalPot).toEqual(
      session.working.additionalPot,
    );
    expect(result.session.working.statistics.counts.mainPot.craftsmanCube).toBe(
      1,
    );
    expect(result.session.pendingRoll).toBeNull();
    expect(result.event).toEqual({
      type: "applied",
      working: result.session.working,
    });
  });

  it("applies a direct additional potential roll", () => {
    const pendingRoll: CubeRollOutput = {
      flow: "direct",
      rolled: {
        tier: "unique",
        potentialIds: ["add-after-1", "add-after-2", "add-after-3"],
      },
    };
    const session = createSession({
      cubeId: "additionalCube",
      pendingRoll,
    });
    const result = reduceCubeSession(session, { type: "apply" });

    expect(result.session.working.additionalPot).toEqual({
      tier: "unique",
      potIds: ["add-after-1", "add-after-2", "add-after-3"],
    });
    expect(result.session.working.mainPot).toEqual(session.working.mainPot);
    expect(result.session.pendingRoll).toBeNull();
  });

  it("creates a restore pending roll and increments cube plus companion counts", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const result = reduceCubeSession(
      createSession({
        cubeId: "restoreCube",
        rng: new FixedRNG([0.99, 0, 0, 0, 0, 0, 0]),
      }),
      {
        type: "roll",
        input: { flow: "restore", fixedIndex: 1 },
      },
    );

    expect(result.session.pendingRoll?.flow).toBe("restore");
    expect(result.session.working.statistics.counts.mainPot.restoreCube).toBe(
      1,
    );
    expect(result.session.working.statistics.counts.mainPot.fixPotential).toBe(
      1,
    );
  });

  it("does not count fixed companion when restore cube cannot fix lines", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const result = reduceCubeSession(
      createSession({
        cubeId: "restoreAdditionalCube",
        rng: new FixedRNG([0.99, 0, 0, 0, 0, 0, 0]),
      }),
      {
        type: "roll",
        input: { flow: "restore", fixedIndex: 1 },
      },
    );

    expect(result.session.pendingRoll?.flow).toBe("restore");
    expect(
      result.session.working.statistics.counts.additionalPot
        .restoreAdditionalCube,
    ).toBe(1);
    expect(result.session.working.statistics.counts.mainPot.fixPotential).toBe(
      undefined,
    );
  });

  it("applies restore after result", () => {
    const pendingRoll: CubeRollOutput = {
      flow: "restore",
      before: {
        tier: "rare",
        potentialIds: ["before-1", "before-2", "before-3"],
      },
      after: {
        tier: "epic",
        potentialIds: ["after-1", "after-2", "after-3"],
      },
      fixedIndex: -1,
    };
    const result = reduceCubeSession(
      createSession({ cubeId: "restoreCube", pendingRoll }),
      { type: "apply", decision: { flow: "restore", side: "after" } },
    );

    expect(result.session.working.mainPot).toEqual({
      tier: "epic",
      potIds: ["after-1", "after-2", "after-3"],
    });
    expect(result.session.pendingRoll).toBeNull();
  });

  it("keeps working potential when applying restore before result", () => {
    const session = createSession({
      cubeId: "restoreCube",
      pendingRoll: {
        flow: "restore",
        before: {
          tier: "rare",
          potentialIds: ["before-1", "before-2", "before-3"],
        },
        after: {
          tier: "epic",
          potentialIds: ["after-1", "after-2", "after-3"],
        },
        fixedIndex: -1,
      },
    });
    const result = reduceCubeSession(session, {
      type: "apply",
      decision: { flow: "restore", side: "before" },
    });

    expect(result.session.working).toBe(session.working);
    expect(result.session.working.mainPot).toEqual(session.working.mainPot);
    expect(result.session.pendingRoll).toBeNull();
  });

  it("creates hexa pending candidates and increments cube count", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const result = reduceCubeSession(
      createSession({
        cubeId: "hexaCube",
        rng: new FixedRNG([0.99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      }),
      {
        type: "roll",
        input: { flow: "hexa" },
      },
    );

    expect(result.session.pendingRoll?.flow).toBe("hexa");
    expect(
      result.session.pendingRoll?.flow === "hexa"
        ? result.session.pendingRoll.candidates.potentialIds
        : [],
    ).toHaveLength(6);
    expect(result.session.working.statistics.counts.mainPot.hexaCube).toBe(1);
  });

  it("applies hexa selected lines in selection order and clears pending roll", () => {
    const session = createSession({
      cubeId: "hexaCube",
      pendingRoll: {
        flow: "hexa",
        candidates: {
          tier: "unique",
          potentialIds: [
            "candidate-0",
            "candidate-1",
            "candidate-2",
            "candidate-3",
            "candidate-4",
            "candidate-5",
          ],
        },
      },
    });
    const result = reduceCubeSession(session, {
      type: "apply",
      decision: { flow: "hexa", selectedIndices: [4, 0, 2] },
    });

    expect(result.session.working.mainPot).toEqual({
      tier: "unique",
      potIds: ["candidate-4", "candidate-0", "candidate-2"],
    });
    expect(result.session.pendingRoll).toBeNull();
  });

  it("rejects hexa apply without a hexa decision", () => {
    const session = createSession({
      cubeId: "hexaCube",
      pendingRoll: {
        flow: "hexa",
        candidates: {
          tier: "unique",
          potentialIds: [
            "candidate-0",
            "candidate-1",
            "candidate-2",
            "candidate-3",
            "candidate-4",
            "candidate-5",
          ],
        },
      },
    });

    expect(() => reduceCubeSession(session, { type: "apply" })).toThrow(
      "Hexa cube apply decision is required",
    );
  });

  it.each([
    {
      label: "duplicate",
      selectedIndices: [0, 0, 1],
      message: "Hexa cube selected indices must not contain duplicates",
    },
    {
      label: "out-of-range",
      selectedIndices: [0, 1, 6],
      message: "Hexa cube selected indices must be integers between 0 and 5",
    },
    {
      label: "non-integer",
      selectedIndices: [0, 1, 1.5],
      message: "Hexa cube selected indices must be integers between 0 and 5",
    },
    {
      label: "wrong-count",
      selectedIndices: [0, 1],
      message: "Hexa cube requires exactly three selected indices",
    },
  ])("rejects hexa apply with $label selected indices", ({ selectedIndices, message }) => {
    const session = createSession({
      cubeId: "hexaCube",
      pendingRoll: {
        flow: "hexa",
        candidates: {
          tier: "unique",
          potentialIds: [
            "candidate-0",
            "candidate-1",
            "candidate-2",
            "candidate-3",
            "candidate-4",
            "candidate-5",
          ],
        },
      },
    });

    expect(() =>
      reduceCubeSession(session, {
        type: "apply",
        decision: {
          flow: "hexa",
          selectedIndices: selectedIndices as [number, number, number],
        },
      }),
    ).toThrow(message);
  });

  it("creates a combine rolled-line pending output and increments cube count", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const result = reduceCubeSession(
      createSession({
        cubeId: "combineCube",
        rng: new FixedRNG([0, 0, 0]),
      }),
      {
        type: "roll",
        input: { flow: "combine", targetIndex: -1 },
      },
    );

    expect(result.session.pendingRoll).toMatchObject({
      flow: "combine",
      step: "rolledLine",
      selectedIndex: 0,
    });
    expect(result.session.working.statistics.counts.mainPot.combineCube).toBe(
      1,
    );
  });

  it("increments combine target mode count by slot-roll attempts", () => {
    vi.spyOn(PotManager, "validateLineRules").mockReturnValue(true);
    const result = reduceCubeSession(
      createSession({
        cubeId: "combineCube",
        rng: new FixedRNG([0, 0.4, 0.8, 0, 0]),
      }),
      {
        type: "roll",
        input: { flow: "combine", targetIndex: 2 },
      },
    );

    expect(result.session.pendingRoll).toMatchObject({
      flow: "combine",
      selectedIndex: 2,
    });
    expect(result.session.working.statistics.counts.mainPot.combineCube).toBe(
      3,
    );
  });

  it("applies a combine rolled line and clears pending roll", () => {
    const session = createSession({
      cubeId: "combineCube",
      pendingRoll: {
        flow: "combine",
        step: "rolledLine",
        selectedIndex: 1,
        rolledPotentialId: "combined-line",
      },
    });
    const result = reduceCubeSession(session, {
      type: "apply",
      decision: { flow: "combine", applyRolledLine: true },
    });

    expect(result.session.working.mainPot).toEqual({
      tier: "rare",
      potIds: ["main-before-1", "combined-line", "main-before-3"],
    });
    expect(result.session.pendingRoll).toBeNull();
  });

  it("discards a combine rolled line when applyRolledLine is false", () => {
    const session = createSession({
      cubeId: "combineCube",
      pendingRoll: {
        flow: "combine",
        step: "rolledLine",
        selectedIndex: 1,
        rolledPotentialId: "combined-line",
      },
    });
    const result = reduceCubeSession(session, {
      type: "apply",
      decision: { flow: "combine", applyRolledLine: false },
    });

    expect(result.session.working).toBe(session.working);
    expect(result.session.working.mainPot).toEqual(session.working.mainPot);
    expect(result.session.pendingRoll).toBeNull();
  });

  it("rejects combine apply without a combine decision", () => {
    const session = createSession({
      cubeId: "combineCube",
      pendingRoll: {
        flow: "combine",
        step: "rolledLine",
        selectedIndex: 1,
        rolledPotentialId: "combined-line",
      },
    });

    expect(() => reduceCubeSession(session, { type: "apply" })).toThrow(
      "Combine cube apply decision is required",
    );
    expect(() =>
      reduceCubeSession(session, {
        type: "apply",
        decision: { flow: "direct" },
      }),
    ).toThrow("Combine cube apply decision is required");
  });

  it("rejects invalid combine targetIndex", () => {
    expect(() =>
      reduceCubeSession(createSession({ cubeId: "combineCube" }), {
        type: "roll",
        input: { flow: "combine", targetIndex: 3 },
      }),
    ).toThrow("targetIndex must be -1 or a line index between 0 and 2");
  });

  it("clears pending roll when discarding", () => {
    const session = createSession({
      pendingRoll: {
        flow: "direct",
        rolled: { tier: "rare", potentialIds: ["a", "b", "c"] },
      },
    });
    const result = reduceCubeSession(session, { type: "discardPendingRoll" });

    expect(result.session.pendingRoll).toBeNull();
    expect(result.event).toEqual({ type: "discardedPendingRoll" });
  });

  it("throws when applying without a pending roll", () => {
    expect(() => reduceCubeSession(createSession(), { type: "apply" })).toThrow(
      "Cannot apply cube session without a pending roll",
    );
  });

});
