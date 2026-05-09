import { getCubeDefinition } from "./cube.registry";
import {
  getCubePotentialPools,
  rollPotentialLines,
  rollRankUp,
} from "./cubeRoll.feature";
import type {
  CubeApplyDecision,
  CubeRollInput,
  CubeRollOutput,
  CubeSession,
  CubeSessionCommand,
  CubeSessionEquipment,
  CubeSessionReduceResult,
} from "./cubeSession.type";

export function reduceCubeSession<TEquipment extends CubeSessionEquipment>(
  session: CubeSession<TEquipment>,
  command: CubeSessionCommand,
): CubeSessionReduceResult<TEquipment> {
  switch (command.type) {
    case "roll":
      return roll(session, command.input ?? { flow: "direct" });
    case "apply":
      return apply(session, command.decision);
    case "discardPendingRoll":
      return {
        session: { ...session, pendingRoll: null },
        event: { type: "discardedPendingRoll" },
      };
  }
}

function roll<TEquipment extends CubeSessionEquipment>(
  session: CubeSession<TEquipment>,
  input: CubeRollInput,
): CubeSessionReduceResult<TEquipment> {
  if (input.flow !== "direct") {
    throw createNotImplementedError(input.flow);
  }

  const cube = getCubeDefinition(session.cubeId);
  const targetSlot = cube.apply;
  const currentTier = session.working[targetSlot].tier;
  const nextTier = rollRankUp({
    cube,
    currentTier,
    rankUpMultiplier: input.rankUpMultiplier ?? 1,
    rng: session.rng,
  });
  const pools = getCubePotentialPools(session.cubeId, {
    subcategory: session.working.subcategory,
    level: session.working.level,
  });
  const potentialIds = rollPotentialLines({
    cube,
    tier: nextTier,
    pools,
    rng: session.rng,
  });
  const output: CubeRollOutput = {
    flow: "direct",
    rolled: {
      tier: nextTier,
      potentialIds,
    },
  };

  return {
    session: {
      ...session,
      pendingRoll: output,
    },
    event: {
      type: "rolled",
      output,
    },
  };
}

function apply<TEquipment extends CubeSessionEquipment>(
  session: CubeSession<TEquipment>,
  decision?: CubeApplyDecision,
): CubeSessionReduceResult<TEquipment> {
  if (decision && decision.flow !== "direct") {
    throw createNotImplementedError(decision.flow);
  }

  const pendingRoll = session.pendingRoll;
  if (!pendingRoll) {
    throw new Error("Cannot apply cube session without a pending roll");
  }

  if (pendingRoll.flow !== "direct") {
    throw createNotImplementedError(pendingRoll.flow);
  }

  const cube = getCubeDefinition(session.cubeId);
  const targetSlot = cube.apply;
  const working = {
    ...session.working,
    [targetSlot]: {
      ...session.working[targetSlot],
      tier: pendingRoll.rolled.tier,
      potIds: [...pendingRoll.rolled.potentialIds],
    },
  } as TEquipment;

  return {
    session: {
      ...session,
      working,
      pendingRoll: null,
    },
    event: {
      type: "applied",
      working,
    },
  };
}

function createNotImplementedError(flow: string) {
  return new Error(`${flow} cube session flow is not implemented`);
}
