import type {
  EquipmentPotentialSlot,
  EquipmentSubcategory,
} from "@/domains/equipment/equipment.type";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import type { RNG } from "@/domains/random/rng.type";
import type { CubeId, CubeCompanionItemId } from "./cube.type";

export type PotentialLines = {
  tier: EquipmentRank;
  potentialIds: string[];
};

export type CubeSessionPotentialGroup = {
  tier: EquipmentRank;
  potentialIds: string[];
};

export type CubeSessionEquipment = {
  subcategory: EquipmentSubcategory;
  level: number;
  statistics: {
    counts: Record<EquipmentPotentialSlot, Partial<Record<string, number>>> & {
      mainPot: Partial<Record<CubeCompanionItemId, number>>;
    };
  };
} & Record<EquipmentPotentialSlot, CubeSessionPotentialGroup>;

export type BaseEquipmentSession<TEquipment> = {
  base: TEquipment;
  working: TEquipment;
  rng: RNG;
};

export type CubeSession<TEquipment = unknown> =
  BaseEquipmentSession<TEquipment> & {
    system: "cube";
    cubeId: CubeId;
    pendingRoll: CubeRollOutput | null;
  };

export type CubeRollOutput =
  | DirectCubeRollOutput
  | RestoreCubeRollOutput
  | HexaCubeRollOutput
  | CombineCubeRollOutput;

export type DirectCubeRollOutput = {
  flow: "direct";
  rolled: PotentialLines;
};

export type RestoreCubeRollOutput = {
  flow: "restore";
  before: PotentialLines;
  after: PotentialLines;
  fixedIndex: number;
};

export type HexaCubeRollOutput = {
  flow: "hexa";
  candidates: PotentialLines;
};

export type CombineCubeRollOutput = {
  flow: "combine";
  step: "rolledLine";
  selectedIndex: number;
  rolledPotentialId: string;
};

export type CubeRollInput =
  | {
      flow: "direct";
      rankUpMultiplier?: number;
      accumulateCount?: number;
    }
  | {
      flow: "restore";
      rankUpMultiplier?: number;
      fixedIndex?: number;
    }
  | {
      flow: "hexa";
      rankUpMultiplier?: number;
    }
  | {
      flow: "combine";
      targetIndex: number;
    };

export type CubeApplyDecision =
  | {
      flow: "direct";
    }
  | {
      flow: "restore";
      side: "before" | "after";
    }
  | {
      flow: "hexa";
      selectedIndices: [number, number, number];
    }
  | {
      flow: "combine";
      applyRolledLine: boolean;
    };

export type CubeSessionCommand =
  | {
      type: "roll";
      input?: CubeRollInput;
    }
  | {
      type: "apply";
      decision?: CubeApplyDecision;
    }
  | {
      type: "discardPendingRoll";
    };

export type CubeSessionEvent<TEquipment = unknown> =
  | {
      type: "rolled";
      output: CubeRollOutput;
    }
  | {
      type: "applied";
      working: TEquipment;
    }
  | {
      type: "discardedPendingRoll";
    };

export type CubeSessionReduceResult<TEquipment = unknown> = {
  session: CubeSession<TEquipment>;
  event?: CubeSessionEvent<TEquipment>;
};
