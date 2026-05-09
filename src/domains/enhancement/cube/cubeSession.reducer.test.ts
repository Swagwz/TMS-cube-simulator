import { describe, expect, it } from "vitest";
import { FixedRNG } from "@/domains/random/fixedRng";
import { SeededRNG } from "@/domains/random/seededRng";
import { reduceCubeSession } from "./cubeSession.reducer";
import type { CubeId } from "./cube.type";
import type {
  CubeSession,
  CubeSessionEquipment,
  CubeRollOutput,
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
  };
}

function createSession(params?: {
  cubeId?: CubeId;
  working?: TestEquipment;
  pendingRoll?: CubeRollOutput | null;
}): CubeSession<TestEquipment> {
  const working = params?.working ?? createEquipment();

  return {
    system: "cube",
    cubeId: params?.cubeId ?? "craftsmanCube",
    base: createEquipment(),
    working,
    rng: new SeededRNG(1),
    pendingRoll: params?.pendingRoll ?? null,
  };
}

describe("reduceCubeSession", () => {
  it("creates a direct pending roll without changing working", () => {
    const session = createSession();
    const result = reduceCubeSession(session, {
      type: "roll",
      input: { flow: "direct" },
    });

    expect(result.session.working).toBe(session.working);
    expect(result.session.pendingRoll?.flow).toBe("direct");
    expect(result.event?.type).toBe("rolled");
  });

  it("applies a direct main potential roll", () => {
    const pendingRoll: CubeRollOutput = {
      flow: "direct",
      rolled: {
        tier: "epic",
        potentialIds: ["main-after-1", "main-after-2", "main-after-3"],
      },
    };
    const session = createSession({
      cubeId: "craftsmanCube",
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

  it("throws for non-direct roll flows", () => {
    const session = createSession();

    expect(() =>
      reduceCubeSession(session, {
        type: "roll",
        input: { flow: "restore" },
      }),
    ).toThrow("restore cube session flow is not implemented");
    expect(() =>
      reduceCubeSession(session, {
        type: "roll",
        input: { flow: "hexa" },
      }),
    ).toThrow("hexa cube session flow is not implemented");
    expect(() =>
      reduceCubeSession(session, {
        type: "roll",
        input: { flow: "combine" },
      }),
    ).toThrow("combine cube session flow is not implemented");
  });

  it("throws for non-direct apply decisions", () => {
    const session = createSession({
      pendingRoll: {
        flow: "direct",
        rolled: { tier: "rare", potentialIds: ["a", "b", "c"] },
      },
    });

    expect(() =>
      reduceCubeSession(session, {
        type: "apply",
        decision: { flow: "restore", side: "after" },
      }),
    ).toThrow("restore cube session flow is not implemented");
  });

  it("can use a fixed rng for direct rolls", () => {
    const session = {
      ...createSession(),
      rng: new FixedRNG([0.99, 0, 0, 0, 0, 0, 0]),
    };
    const result = reduceCubeSession(session, {
      type: "roll",
      input: { flow: "direct", rankUpMultiplier: 1 },
    });

    expect(result.session.pendingRoll?.flow).toBe("direct");
  });
});
