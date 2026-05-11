import type { RNG } from "@/domains/random/rng.type";
import type { SoulPotentialPoolEntry } from "./soulRoll.feature";
import type { SoulId } from "./soul.type";

export type SoulSessionEquipment = {
  level: number;
  soul: string | null;
  statistics: {
    counts: {
      soul: Partial<Record<SoulId, number>>;
    };
  };
};

export type SoulRollOutput = {
  rolledSoulId: string;
};

export type SoulSession<TEquipment = unknown> = {
  system: "soul";
  soulId: SoulId;
  base: TEquipment;
  working: TEquipment;
  rng: RNG;
  pool: SoulPotentialPoolEntry[];
  pendingRoll: SoulRollOutput | null;
};

export type SoulSessionCommand =
  | {
      type: "roll";
    }
  | {
      type: "apply";
    }
  | {
      type: "discardPendingRoll";
    };

export type SoulSessionEvent<TEquipment = unknown> =
  | {
      type: "rolled";
      output: SoulRollOutput;
    }
  | {
      type: "applied";
      working: TEquipment;
    }
  | {
      type: "discardedPendingRoll";
    };

export type SoulSessionReduceResult<TEquipment = unknown> = {
  session: SoulSession<TEquipment>;
  event?: SoulSessionEvent<TEquipment>;
};
