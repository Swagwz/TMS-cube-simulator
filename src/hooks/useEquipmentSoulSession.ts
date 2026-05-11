import { useCallback, useEffect, useMemo, useState } from "react";
import { reduceSoulSession } from "@/domains/enhancement/soul/soulSession.reducer";
import type { SoulSession } from "@/domains/enhancement/soul/soulSession.type";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import { CryptoRNG } from "@/domains/random/cryptoRng";
import {
  useEquipmentStore,
  type EquipmentInstance,
} from "@/store/useEquipmentStore";
import type { EquipmentSoulSessionController } from "@/contexts/useEquipmentEnhancementSessionContext";

type UseEquipmentSoulSessionParams = {
  itemId: string | null;
  baseInstance: EquipmentInstance | null;
  closeModal: () => void;
};

export function useEquipmentSoulSession({
  itemId,
  baseInstance,
  closeModal,
}: UseEquipmentSoulSessionParams): EquipmentSoulSessionController | null {
  const soul = useMemo(() => {
    if (!itemId || !SoulManager.isItem(itemId)) return null;

    return SoulManager.getItem(itemId);
  }, [itemId]);

  const [session, setSession] =
    useState<SoulSession<EquipmentInstance> | null>(null);

  useEffect(() => {
    if (!soul || !baseInstance) {
      setSession(null);
      return;
    }

    setSession({
      system: "soul",
      soulId: soul.id,
      base: structuredClone(baseInstance),
      working: structuredClone(baseInstance),
      rng: new CryptoRNG(),
      pendingRoll: null,
    });
  }, [baseInstance, soul]);

  const commitAndClose = useCallback(() => {
    if (!session) return;

    useEquipmentStore.getState().syncInstance(session.working);
    closeModal();
  }, [closeModal, session]);

  const rollSoulAndApply = useCallback(() => {
    if (!session) return;

    const rolled = reduceSoulSession(session, { type: "roll" });
    const applied = reduceSoulSession(rolled.session, { type: "apply" });

    setSession(applied.session);
  }, [session]);

  return useMemo(() => {
    if (!session || !soul) return null;

    return {
      session,
      soul,
      working: session.working,
      pendingRoll: session.pendingRoll,
      commitAndClose,
      rollSoulAndApply,
    };
  }, [commitAndClose, rollSoulAndApply, session, soul]);
}
