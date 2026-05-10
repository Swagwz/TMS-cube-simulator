import { useCallback, useEffect, useMemo, useState } from "react";
import type { EquipmentEnhancementItemId } from "@/domains/equipment/equipment.type";
import { getCubeDefinition } from "@/domains/enhancement/cube/cube.registry";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import { reduceCubeSession } from "@/domains/enhancement/cube/cubeSession.reducer";
import type {
  CubeRollInput,
  CubeSession,
} from "@/domains/enhancement/cube/cubeSession.type";
import { CryptoRNG } from "@/domains/random/cryptoRng";
import { useAccountStore } from "@/store/useAccountStore";
import {
  useEquipmentStore,
  type EquipmentInstance,
} from "@/store/useEquipmentStore";
import type { EquipmentCubeSessionController } from "@/contexts/useEquipmentCubeSessionContext";

type UseEquipmentCubeSessionParams = {
  selectedItemId: EquipmentEnhancementItemId | null;
  localData: EquipmentInstance | null;
  closeModal: () => void;
};

export function useEquipmentCubeSession({
  selectedItemId,
  localData,
  closeModal,
}: UseEquipmentCubeSessionParams): EquipmentCubeSessionController | null {
  const cube = useMemo(() => {
    if (!selectedItemId || selectedItemId === "wuGongJewel") return null;

    const definition = getCubeDefinition(selectedItemId as CubeId);
    return definition.workflow === "direct" ||
      definition.workflow === "restore" ||
      definition.workflow === "hexa"
      ? definition
      : null;
  }, [selectedItemId]);

  const [session, setSession] =
    useState<CubeSession<EquipmentInstance> | null>(null);

  useEffect(() => {
    if (!cube || !localData) {
      setSession(null);
      return;
    }

    setSession({
      system: "cube",
      cubeId: cube.id,
      base: structuredClone(localData),
      working: structuredClone(localData),
      rng: new CryptoRNG(),
      pendingRoll: null,
    });
  }, [cube, localData]);

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
      discardPendingRoll,
    };
  }, [
    applyHexa,
    applyRestore,
    commitAndClose,
    cube,
    discardPendingRoll,
    rollHexa,
    rollDirectAndApply,
    rollRestore,
    session,
  ]);
}
