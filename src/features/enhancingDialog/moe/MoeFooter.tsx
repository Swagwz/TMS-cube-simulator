import React from "react";
import EnhancerFooter from "../EnhancerFooter";
import Counter from "../Counter";
import { useMoeEnhancingContext } from "@/contexts/useMoeEnhancingContext";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";

type Props = { children: React.ReactNode };

export default function MoeFooter({ children }: Props) {
  const { localData, selectedItemId } = useMoeEnhancingContext();
  const item = MoeManager.getMoeCubeMetadata(selectedItemId);

  return (
    <EnhancerFooter
      counter={
        <Counter
          items={[
            {
              id: item.id,
              name: item.name,
              imagePath: item.imagePath,
              count: localData.statistics.counts[item.id] || 0,
            },
          ]}
        />
      }
    >
      {children}
    </EnhancerFooter>
  );
}
