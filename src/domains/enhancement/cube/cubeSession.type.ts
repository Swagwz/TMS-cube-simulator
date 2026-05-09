import type { EquipmentRank } from "@/domains/potential/potential.type";
import type { CubeId } from "./cube.type";

export type RNG = {
  next: () => number;
};

export type PotentialLines = {
  tier: EquipmentRank;
  potentialIds: string[];
};

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
  rolled: PotentialLines;
};

export type HexaCubeRollOutput = {
  flow: "hexa";
  candidates: PotentialLines;
};

export type CombineCubeRollOutput =
  | {
      flow: "combine";
      step: "selectedLine";
      selectedIndex: number;
    }
  | {
      flow: "combine";
      step: "rolledLine";
      selectedIndex: number;
      rolledPotentialId: string;
    };

export type CubeRollInput =
  | {
      flow: "direct";
    }
  | {
      flow: "restore";
      fixedIndices?: number[];
    }
  | {
      flow: "hexa";
    }
  | {
      flow: "combine";
      targetIndex?: number;
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

export type CubeSessionCommand<TEquipment = unknown> =
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
    }
  | {
      type: "replaceWorking";
      working: TEquipment;
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
