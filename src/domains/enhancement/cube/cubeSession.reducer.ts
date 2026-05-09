import { getCubeCompanionItems, getCubeDefinition } from "./cube.registry";
import {
  getCubePotentialPools,
  rollCombineCube,
  rollDirectCube,
  rollHexaCube,
  rollRestoreCube,
} from "./cubeRoll.feature";
import type { EquipmentPotentialSlot } from "@/domains/equipment/equipment.type";
import type { CubeDefinition } from "./cube.type";
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
      return roll(session, command.input);
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
  input?: CubeRollInput,
): CubeSessionReduceResult<TEquipment> {
  const cube = getCubeDefinition(session.cubeId);
  const finalInput = input ?? getDefaultRollInput(cube.workflow);

  if (finalInput.flow !== cube.workflow) {
    throw new Error(
      `Cube workflow mismatch: ${session.cubeId} uses ${cube.workflow}, got ${finalInput.flow}`,
    );
  }

  const pools = getCubePotentialPools(session.cubeId, {
    subcategory: session.working.subcategory,
    level: session.working.level,
  });
  let output: CubeRollOutput;
  let shouldCountFixPotential = false;
  let rollCount = 1;

  switch (cube.workflow) {
    case "direct": {
      if (finalInput.flow !== "direct") {
        throw createNotImplementedError(finalInput.flow);
      }

      output = rollDirectCube({
        cube,
        current: getCurrentPotentialLines(session.working, cube.apply),
        pools,
        rankUpMultiplier: finalInput.rankUpMultiplier,
        accumulateCount: finalInput.accumulateCount,
        rng: session.rng,
      });
      break;
    }
    case "restore": {
      if (finalInput.flow !== "restore") {
        throw createNotImplementedError(finalInput.flow);
      }

      const fixedIndex = finalInput.fixedIndex ?? -1;
      const canFixLine = getCubeCompanionItems(session.cubeId).some(
        (item) => item.id === "fixPotential",
      );
      output = rollRestoreCube({
        cube,
        current: getCurrentPotentialLines(session.working, cube.apply),
        pools,
        fixedIndex,
        canFixLine,
        rankUpMultiplier: finalInput.rankUpMultiplier,
        rng: session.rng,
      });
      shouldCountFixPotential = canFixLine && fixedIndex >= 0;
      break;
    }
    case "hexa": {
      if (finalInput.flow !== "hexa") {
        throw createNotImplementedError(finalInput.flow);
      }

      output = rollHexaCube({
        cube,
        current: getCurrentPotentialLines(session.working, cube.apply),
        pools,
        rankUpMultiplier: finalInput.rankUpMultiplier,
        rng: session.rng,
      });
      break;
    }
    case "combine": {
      if (finalInput.flow !== "combine") {
        throw createNotImplementedError(finalInput.flow);
      }

      const result = rollCombineCube({
        cube,
        current: getCurrentPotentialLines(session.working, cube.apply),
        pools,
        targetIndex: finalInput.targetIndex,
        rng: session.rng,
      });
      output = result.output;
      rollCount = result.attempts;
      break;
    }
  }
  const working = incrementCubeRollCount({
    working: session.working,
    cube,
    rollCount,
    countFixPotential: shouldCountFixPotential,
  });

  return {
    session: {
      ...session,
      working,
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
  const pendingRoll = session.pendingRoll;
  if (!pendingRoll) {
    throw new Error("Cannot apply cube session without a pending roll");
  }

  const cube = getCubeDefinition(session.cubeId);
  let working: TEquipment;

  switch (pendingRoll.flow) {
    case "direct":
      if (decision && decision.flow !== "direct") {
        throw createNotImplementedError(decision.flow);
      }
      working = writePotentialLines(session.working, cube.apply, pendingRoll.rolled);
      break;
    case "restore":
      if (!decision || decision.flow !== "restore") {
        throw new Error("Restore cube apply decision is required");
      }
      working =
        decision.side === "after"
          ? writePotentialLines(session.working, cube.apply, pendingRoll.after)
          : session.working;
      break;
    case "hexa": {
      if (!decision || decision.flow !== "hexa") {
        throw new Error("Hexa cube apply decision is required");
      }
      validateHexaSelectedIndices(decision.selectedIndices);
      working = writePotentialLines(session.working, cube.apply, {
        tier: pendingRoll.candidates.tier,
        potentialIds: decision.selectedIndices.map(
          (index) => pendingRoll.candidates.potentialIds[index]!,
        ),
      });
      break;
    }
    case "combine": {
      if (!decision || decision.flow !== "combine") {
        throw new Error("Combine cube apply decision is required");
      }

      if (!decision.applyRolledLine) {
        working = session.working;
        break;
      }

      const potentialIds = [...session.working[cube.apply].potentialIds];
      potentialIds[pendingRoll.selectedIndex] = pendingRoll.rolledPotentialId;
      working = writePotentialLines(session.working, cube.apply, {
        tier: session.working[cube.apply].tier,
        potentialIds,
      });
      break;
    }
  }

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

function getDefaultRollInput(
  workflow: CubeDefinition["workflow"],
): CubeRollInput {
  switch (workflow) {
    case "direct":
      return { flow: "direct" };
    case "restore":
      return { flow: "restore" };
    case "hexa":
      return { flow: "hexa" };
    case "combine":
      return { flow: "combine", targetIndex: -1 };
  }
}

function validateHexaSelectedIndices(indices: readonly number[]) {
  if (indices.length !== 3) {
    throw new Error("Hexa cube requires exactly three selected indices");
  }

  const seen = new Set<number>();

  for (const index of indices) {
    if (!Number.isInteger(index) || index < 0 || index > 5) {
      throw new Error(
        "Hexa cube selected indices must be integers between 0 and 5",
      );
    }

    if (seen.has(index)) {
      throw new Error("Hexa cube selected indices must not contain duplicates");
    }

    seen.add(index);
  }
}

function getCurrentPotentialLines<TEquipment extends CubeSessionEquipment>(
  working: TEquipment,
  slot: EquipmentPotentialSlot,
) {
  return {
    tier: working[slot].tier,
    potentialIds: [...working[slot].potentialIds],
  };
}

function writePotentialLines<TEquipment extends CubeSessionEquipment>(
  working: TEquipment,
  slot: EquipmentPotentialSlot,
  lines: { tier: TEquipment[typeof slot]["tier"]; potentialIds: string[] },
) {
  return {
    ...working,
    [slot]: {
      ...working[slot],
      tier: lines.tier,
      potentialIds: [...lines.potentialIds],
    },
  } as TEquipment;
}

function incrementCubeRollCount<TEquipment extends CubeSessionEquipment>({
  working,
  cube,
  rollCount,
  countFixPotential,
}: {
  working: TEquipment;
  cube: CubeDefinition;
  rollCount: number;
  countFixPotential: boolean;
}) {
  const slot = cube.apply;
  const counts = working.statistics.counts;
  const slotCounts = counts[slot];
  const nextSlotCounts = {
    ...slotCounts,
    [cube.id]: (slotCounts[cube.id] ?? 0) + rollCount,
  };
  const nextCounts = {
    ...counts,
    [slot]: nextSlotCounts,
  };

  if (countFixPotential) {
    nextCounts.mainPot = {
      ...nextCounts.mainPot,
      fixPotential: (nextCounts.mainPot.fixPotential ?? 0) + 1,
    };
  }

  return {
    ...working,
    statistics: {
      ...working.statistics,
      counts: nextCounts,
    },
  } as TEquipment;
}
