import { describe, expect, it } from "vitest";
import { FixedRNG } from "@/domains/random/fixedRng";
import { SoulManager } from "./soulManager";
import { reduceSoulSession } from "./soulSession.reducer";
import type { SoulRollOutput, SoulSession, SoulSessionEquipment } from "./soulSession.type";

type TestEquipment = SoulSessionEquipment & {
  id: string;
};

function createEquipment(): TestEquipment {
  return {
    id: "equipment-1",
    level: 200,
    soul: null,
    statistics: {
      counts: {
        soul: {},
      },
    },
  };
}

function createSession(params?: {
  working?: TestEquipment;
  pendingRoll?: SoulRollOutput | null;
  rng?: SoulSession<TestEquipment>["rng"];
}): SoulSession<TestEquipment> {
  const working = params?.working ?? createEquipment();

  return {
    system: "soul",
    soulId: "wuGongJewel",
    base: createEquipment(),
    working,
    rng: params?.rng ?? new FixedRNG([0]),
    pool: SoulManager.getPotPool(working.level).map(({ id, weight }) => ({
      id,
      weight,
    })),
    pendingRoll: params?.pendingRoll ?? null,
  };
}

describe("reduceSoulSession", () => {
  it("creates a pending roll without changing working soul", () => {
    const firstSoulId = SoulManager.getPotPool(200)[0]!.id;
    const session = createSession({
      working: {
        ...createEquipment(),
        soul: "before-soul",
      },
      rng: new FixedRNG([0]),
    });

    const result = reduceSoulSession(session, { type: "roll" });

    expect(result.session.working.soul).toBe("before-soul");
    expect(result.session.pendingRoll).toEqual({
      rolledSoulId: firstSoulId,
    });
    expect(result.event).toEqual({
      type: "rolled",
      output: { rolledSoulId: firstSoulId },
    });
  });

  it("increments soul usage count on roll", () => {
    const result = reduceSoulSession(createSession(), { type: "roll" });

    expect(result.session.working.statistics.counts.soul.wuGongJewel).toBe(1);
  });

  it("applies a pending soul roll and clears pending state", () => {
    const session = createSession({
      pendingRoll: {
        rolledSoulId: "rolled-soul",
      },
    });

    const result = reduceSoulSession(session, { type: "apply" });

    expect(result.session.working.soul).toBe("rolled-soul");
    expect(result.session.pendingRoll).toBeNull();
    expect(result.event).toEqual({
      type: "applied",
      working: result.session.working,
    });
  });

  it("clears pending roll when discarding", () => {
    const result = reduceSoulSession(
      createSession({
        pendingRoll: {
          rolledSoulId: "rolled-soul",
        },
      }),
      { type: "discardPendingRoll" },
    );

    expect(result.session.pendingRoll).toBeNull();
    expect(result.event).toEqual({ type: "discardedPendingRoll" });
  });

  it("throws when applying without a pending roll", () => {
    expect(() => reduceSoulSession(createSession(), { type: "apply" })).toThrow(
      "Cannot apply soul session without a pending roll",
    );
  });

  it("stores a level-derived soul pool on the session", () => {
    const session = createSession({
      working: {
        ...createEquipment(),
        level: 120,
      },
    });

    expect(session.pool).toEqual(
      SoulManager.getPotPool(120).map(({ id, weight }) => ({ id, weight })),
    );
  });
});
