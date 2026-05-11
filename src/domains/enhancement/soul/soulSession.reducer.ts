import { rollSoulPotential } from "./soulRoll.feature";
import { incrementStatisticsCount } from "@/domains/equipment/equipmentStatistics";
import type {
  SoulSession,
  SoulSessionCommand,
  SoulSessionEquipment,
  SoulSessionReduceResult,
} from "./soulSession.type";

export function reduceSoulSession<TEquipment extends SoulSessionEquipment>(
  session: SoulSession<TEquipment>,
  command: SoulSessionCommand,
): SoulSessionReduceResult<TEquipment> {
  switch (command.type) {
    case "roll":
      return roll(session);
    case "apply":
      return apply(session);
    case "discardPendingRoll":
      return {
        session: { ...session, pendingRoll: null },
        event: { type: "discardedPendingRoll" },
      };
  }
}

function roll<TEquipment extends SoulSessionEquipment>(
  session: SoulSession<TEquipment>,
): SoulSessionReduceResult<TEquipment> {
  const output = {
    rolledSoulId: rollSoulPotential({
      pool: session.pool,
      rng: session.rng,
    }),
  };
  const working = incrementStatisticsCount(
    session.working,
    "soul",
    session.soulId,
  ) as TEquipment;

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

function apply<TEquipment extends SoulSessionEquipment>(
  session: SoulSession<TEquipment>,
): SoulSessionReduceResult<TEquipment> {
  if (!session.pendingRoll) {
    throw new Error("Cannot apply soul session without a pending roll");
  }

  const working = {
    ...session.working,
    soul: session.pendingRoll.rolledSoulId,
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
