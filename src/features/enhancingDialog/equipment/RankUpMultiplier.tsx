import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { weightsToProbabilities } from "@/utils/weightsToProbabilities";

import { useEnhancingContext } from "@/contexts/useEnhancingContext";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import { PotManager } from "@/domains/potential/potManager";
import { useAccountStore } from "@/store/useAccountStore";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";

const BUTTON_OPTIONS = [1, 2, 3];

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
        <ButtonGroup>
          {BUTTON_OPTIONS.map((val) => (
            <Button
              variant="primary"
              className={cn(
                val === rankUpMultiplier &&
                  "bg-accent-main hover:bg-accent-dark text-accent-main-foreground hover:text-accent-main-foreground",
              )}
              onClick={() => setRankUpMultiplier(val)}
              key={val}
            >
              x{val}
            </Button>
          ))}
        </ButtonGroup>
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
                      ? "同階"
                      : `升${PotManager.rankToZh(PotManager.indexToRank(currTierIndex + i))}`;
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
  const { selectedEhmId, localData } = useEnhancingContext();
  const {
    rankUpMultiplier,
    setRankUpMultiplier,
    userConfig,
    setShowRankUpProb,
  } = useAccountStore();

  const data = useMemo(() => {
    if (
      !selectedEhmId ||
      selectedEhmId === "wuGongJewel" ||
      selectedEhmId === "shinyAdditionalCube"
    ) {
      return null;
    }

    const meta = CubeManager.getItem(selectedEhmId);
    const tier = localData[meta.apply].tier;

    if (tier === "legendary") {
      return null;
    }

    const rankUpWeights = CubeManager.getScaledRankUpWeights(
      selectedEhmId,
      tier,
    );

    if (rankUpWeights.length === 0) {
      return null;
    }

    const rankUpProbs = weightsToProbabilities(rankUpWeights);
    const currTierIndex = PotManager.getIndex(tier);

    return {
      rankUpProbs,
      currTierIndex,
    };
  }, [selectedEhmId, localData, rankUpMultiplier]);

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
