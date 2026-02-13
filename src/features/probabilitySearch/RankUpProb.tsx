import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import { PotManager } from "@/domains/potential/potManager";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import { cn } from "@/lib/utils";
import { weightsToProbabilities } from "@/utils/weightsToProbabilities";

type Props = {
  cube: CubeId;
  rank: EquipmentRank;
};

export default function RankUpProb({ cube, rank }: Props) {
  const [multiplier, setMultiplier] = useState(1);
  const meta = CubeManager.getItem(cube);
  if (!meta.rankUp) return <div className="mt-4 text-sm">此方塊不可跳框</div>;
  if (!meta.rankUp[rank])
    return <div className="mt-4 text-sm">此方塊已至最高階級，不可再跳框</div>;

  if (cube === "shinyAdditionalCube") {
    const { ceiling, probIncr, baseProb } = CubeManager.getShinyCeiling(rank);
    return (
      <details className="mt-4">
        <summary className="text-muted-foreground cursor-pointer text-center text-sm">
          跳框機制
        </summary>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>基礎機率</TableHead>
              <TableHead>每次增加</TableHead>
              <TableHead>保底次數</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{baseProb}%</TableCell>
              <TableCell>{probIncr}%</TableCell>
              <TableCell>{ceiling}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </details>
    );
  }

  const rankUpWeights = CubeManager.getScaledRankUpWeights(
    cube,
    rank,
    multiplier,
  );
  const rankUpProbs = weightsToProbabilities(rankUpWeights);
  const currTierIndex = PotManager.getIndex(rank);

  return (
    <details className="mt-4" open>
      <summary className="text-muted-foreground cursor-pointer text-center text-sm">
        跳框機率
      </summary>
      <div className="my-2 flex justify-center">
        <ButtonGroup>
          {[1, 2, 3].map((val) => (
            <Button
              key={val}
              variant="outline"
              className={cn(
                val === multiplier &&
                  "bg-accent-main hover:bg-accent-dark text-accent-main-foreground hover:text-accent-main-foreground",
              )}
              onClick={() => setMultiplier(val)}
            >
              x{val}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>結果</TableHead>
            <TableHead className="text-right">機率</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankUpProbs.map((prob, i) => {
            const label =
              i === 0
                ? "同階"
                : `升${PotManager.rankToZh(PotManager.indexToRank(currTierIndex + i))}`;
            return (
              <TableRow key={i}>
                <TableCell>{label}</TableCell>
                <TableCell className="text-right">
                  {(prob * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </details>
  );
}
