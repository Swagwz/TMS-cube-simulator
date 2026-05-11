import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { weightsToProbabilities } from "@/utils/weightsToProbabilities";

import { useEquipmentEnhancementNavigator } from "@/contexts/useEquipmentEnhancementSessionContext";
import { getScaledRankUpWeights } from "@/domains/enhancement/cube/cubeRoll.feature";
import { PotManager } from "@/domains/potential/potManager";
import { useAccountStore } from "@/store/useAccountStore";
import FormField from "@/components/FormField";
import { Checkbox } from "@/components/ui/checkbox";
import MultiplierSelector from "@/components/MultiplierSelector";

export default function RankUpMultiplier() {
  const {
    shouldRender,
    rankUpProbs,
    currTierIndex,
    rankUpMultiplier,
    setRankUpMultiplier,
    userConfig,
    setShowRankUpProb,
  } = useRankUpMultiplier();

  if (!shouldRender) return null;

  return (
    <div>
      <FormField
        label={
          <div className="flex items-center gap-2">
            跳框機率倍率
            <div className="flex items-center gap-1">
              <Checkbox
                id="show-prob"
                checked={userConfig.showRankUpProb}
                onCheckedChange={(v) => setShowRankUpProb(v as boolean)}
                className="data-[state=checked]:border-white data-[state=checked]:bg-transparent"
              />
              <label
                htmlFor="show-prob"
                className="text-glass-foreground cursor-pointer text-xs font-normal"
              >
                顯示機率
              </label>
            </div>
          </div>
        }
      >
        <MultiplierSelector
          value={rankUpMultiplier}
          onChange={(val: number) => setRankUpMultiplier(val)}
        />
      </FormField>
      <AnimatePresence>
        {userConfig.showRankUpProb && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-glass-foreground overflow-hidden text-sm"
          >
            <table className="mt-2 w-full text-left">
              <tbody>
                {rankUpProbs.map((prob, i) => {
                  const label =
                    i === 0
                      ? "維持"
                      : `${PotManager.rankToZh(PotManager.indexToRank(currTierIndex + i))}`;
                  return (
                    <tr key={i}>
                      <td>{label}</td>
                      <td className="text-right">{(prob * 100).toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useRankUpMultiplier() {
  const navigator = useEquipmentEnhancementNavigator();
  const {
    rankUpMultiplier,
    setRankUpMultiplier,
    userConfig,
    setShowRankUpProb,
  } = useAccountStore();

  const data = useMemo(() => {
    if (!navigator || navigator.kind !== "cube") {
      return null;
    }

    const { cube, working } = navigator.controller;
    if (cube.rankUpType !== "standard") return null;

    const tier = working[cube.apply].tier;

    if (tier === "legendary") {
      return null;
    }

    const rankUpWeights = getScaledRankUpWeights({
      cube,
      currentTier: tier,
      rankUpMultiplier,
    });

    if (rankUpWeights.length === 0) {
      return null;
    }

    const rankUpProbs = weightsToProbabilities(rankUpWeights);
    const currTierIndex = PotManager.getIndex(tier);

    return {
      rankUpProbs,
      currTierIndex,
    };
  }, [navigator, rankUpMultiplier]);

  return {
    shouldRender: !!data,
    rankUpProbs: data?.rankUpProbs ?? [],
    currTierIndex: data?.currTierIndex ?? -1,
    rankUpMultiplier,
    setRankUpMultiplier,
    userConfig,
    setShowRankUpProb,
  };
}
