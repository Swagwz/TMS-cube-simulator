import { useCallback, useEffect, useMemo, useState } from "react";
import { getCubeDefinition } from "@/domains/enhancement/cube/cube.registry";
import { getCubePotentialPools } from "@/domains/enhancement/cube/cubeRoll.feature";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import { reduceCubeSession } from "@/domains/enhancement/cube/cubeSession.reducer";
import type {
  CubeSessionReduceResult,
  CubeRollInput,
  CubeSession,
  CubeSessionEquipment,
} from "@/domains/enhancement/cube/cubeSession.type";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import { CryptoRNG } from "@/domains/random/cryptoRng";
import { useAccountStore } from "@/store/useAccountStore";
import {
  useEquipmentStore,
  type EquipmentInstance,
} from "@/store/useEquipmentStore";
import type { EquipmentCubeSessionController } from "@/contexts/useEquipmentEnhancementSessionContext";

type UseEquipmentCubeSessionParams = {
  itemId: string | null;
  baseInstance: EquipmentInstance | null;
  closeModal: () => void;
};

export function runCombineRollAndApply<
  TEquipment extends CubeSessionEquipment,
>(
  session: CubeSession<TEquipment>,
  targetIndex: number,
): CubeSessionReduceResult<TEquipment> {
  const rolled = reduceCubeSession(session, {
    type: "roll",
    input: { flow: "combine", targetIndex },
  });

  return reduceCubeSession(rolled.session, {
    type: "apply",
    decision: { flow: "combine", applyRolledLine: true },
  });
}

export function useEquipmentCubeSession({
  itemId,
  baseInstance,
  closeModal,
}: UseEquipmentCubeSessionParams): EquipmentCubeSessionController | null {
  const cube = useMemo(() => {
    if (!itemId || SoulManager.isItem(itemId)) return null;

    const definition = getCubeDefinition(itemId as CubeId);
    return definition.workflow === "direct" ||
      definition.workflow === "restore" ||
      definition.workflow === "hexa" ||
      definition.workflow === "combine"
      ? definition
      : null;
  }, [itemId]);

  const [session, setSession] =
    useState<CubeSession<EquipmentInstance> | null>(null);

  useEffect(() => {
    if (!cube || !baseInstance) {
      setSession(null);
      return;
    }

    setSession({
      system: "cube",
      cubeId: cube.id,
      base: structuredClone(baseInstance),
      working: structuredClone(baseInstance),
      rng: new CryptoRNG(),
      pools: getCubePotentialPools(cube.id, {
        subcategory: baseInstance.subcategory,
        level: baseInstance.level,
      }),
      pendingRoll: null,
    });
  }, [baseInstance, cube]);

  const commitAndClose = useCallback(() => {
    if (!session) return;

    useEquipmentStore.getState().syncInstance(session.working);
    closeModal();
  }, [closeModal, session]);

  const rollDirectAndApply = useCallback(() => {
    if (!session || !cube) return;

    const beforeTier = session.working[cube.apply].tier;
    const accountState = useAccountStore.getState();
    const input: CubeRollInput = {
      flow: "direct",
      rankUpMultiplier: accountState.rankUpMultiplier,
      accumulateCount:
        cube.rankUpType === "accumulate"
          ? accountState.shinyPity[beforeTier]
          : undefined,
    };

    const rolled = reduceCubeSession(session, {
      type: "roll",
      input,
    });
    const output = rolled.event?.type === "rolled" ? rolled.event.output : null;

    const applied = reduceCubeSession(rolled.session, {
      type: "apply",
      decision: { flow: "direct" },
    });

    if (cube.id === "shinyAdditionalCube" && output?.flow === "direct") {
      if (output.rolled.tier !== beforeTier) {
        accountState.resetShinyPity(beforeTier);
      } else {
        accountState.incrementShinyPity(beforeTier);
      }
    }

    setSession(applied.session);
  }, [cube, session]);

  const rollRestore = useCallback(
    (fixedIndex: number) => {
      if (!session || !cube) return;

      const accountState = useAccountStore.getState();
      const result = reduceCubeSession(session, {
        type: "roll",
        input: {
          flow: "restore",
          fixedIndex,
          rankUpMultiplier: accountState.rankUpMultiplier,
        },
      });

      setSession(result.session);
    },
    [cube, session],
  );

  const applyRestore = useCallback(
    (side: "before" | "after") => {
      if (!session) return;

      const result = reduceCubeSession(session, {
        type: "apply",
        decision: { flow: "restore", side },
      });

      setSession(result.session);
    },
    [session],
  );

  const rollHexa = useCallback(() => {
    if (!session) return;

    const accountState = useAccountStore.getState();
    const result = reduceCubeSession(session, {
      type: "roll",
      input: {
        flow: "hexa",
        rankUpMultiplier: accountState.rankUpMultiplier,
      },
    });

    setSession(result.session);
  }, [session]);

  const applyHexa = useCallback(
    (selectedIndices: [number, number, number]) => {
      if (!session) return;

      const result = reduceCubeSession(session, {
        type: "apply",
        decision: { flow: "hexa", selectedIndices },
      });

      setSession(result.session);
    },
    [session],
  );

  const rollCombine = useCallback(
    (targetIndex: number) => {
      if (!session) return;

      const result = reduceCubeSession(session, {
        type: "roll",
        input: { flow: "combine", targetIndex },
      });

      setSession(result.session);
    },
    [session],
  );

  const rollCombineAndApply = useCallback(
    (targetIndex: number) => {
      if (!session) return;

      const applied = runCombineRollAndApply(session, targetIndex);
      setSession(applied.session);
    },
    [session],
  );

  const applyCombine = useCallback(
    (applyRolledLine: boolean) => {
      if (!session) return;

      const result = reduceCubeSession(session, {
        type: "apply",
        decision: { flow: "combine", applyRolledLine },
      });

      setSession(result.session);
    },
    [session],
  );

  const discardPendingRoll = useCallback(() => {
    if (!session) return;

    const result = reduceCubeSession(session, {
      type: "discardPendingRoll",
    });

    setSession(result.session);
  }, [session]);

  return useMemo(() => {
    if (!cube || !session) return null;

    return {
      session,
      cube,
      slot: cube.apply,
      working: session.working,
      pendingRoll: session.pendingRoll,
      commitAndClose,
      rollDirectAndApply,
      rollRestore,
      applyRestore,
      rollHexa,
      applyHexa,
      rollCombine,
      rollCombineAndApply,
      applyCombine,
      discardPendingRoll,
    };
  }, [
    applyCombine,
    applyHexa,
    applyRestore,
    commitAndClose,
    cube,
    discardPendingRoll,
    rollCombine,
    rollCombineAndApply,
    rollHexa,
    rollDirectAndApply,
    rollRestore,
    session,
  ]);
}
