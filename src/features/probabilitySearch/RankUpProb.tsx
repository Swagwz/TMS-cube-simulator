import { useState } from "react";
import MultiplierSelector from "@/components/MultiplierSelector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCubeDefinition } from "@/domains/enhancement/cube/cube.registry";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import {
  getScaledRankUpWeights,
  getShinyCeiling,
} from "@/domains/enhancement/cube/cubeRoll.feature";
import { PotManager } from "@/domains/potential/potManager";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import { weightsToProbabilities } from "@/utils/weightsToProbabilities";

type Props = {
  cube: CubeId;
  rank: EquipmentRank;
};

export default function RankUpProb({ cube, rank }: Props) {
  const [multiplier, setMultiplier] = useState(1);
  const meta = getCubeDefinition(cube);

  if (!meta.rankUp) {
    return <div className="title-error">這個方塊不會跳框</div>;
  }

  if (!meta.rankUp[rank]) {
    return <div className="title-error">這個方塊在此階級不會跳框</div>;
  }

  if (cube === "shinyAdditionalCube") {
    return <ShinyAdditionalCubeRankUpTable rank={rank} />;
  }

  return (
    <>
      <div className="mb-2 flex justify-center">
        <MultiplierSelector value={multiplier} onChange={setMultiplier} />
      </div>
      <StandardRankUpTable cube={cube} rank={rank} multiplier={multiplier} />
    </>
  );
}

function StandardRankUpTable({
  cube,
  rank,
  multiplier,
}: {
  cube: Exclude<CubeId, "shinyAdditionalCube">;
  rank: EquipmentRank;
  multiplier: number;
}) {
  const cubeDefinition = getCubeDefinition(cube);
  const rankUpWeights = getScaledRankUpWeights({
    cube: cubeDefinition,
    currentTier: rank,
    rankUpMultiplier: multiplier,
  });
  const rankUpProbs = weightsToProbabilities(rankUpWeights);
  const currTierIndex = PotManager.getIndex(rank);

  return (
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
              ? "維持"
              : `${PotManager.rankToZh(PotManager.indexToRank(currTierIndex + i))}`;
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
  );
}

function ShinyAdditionalCubeRankUpTable({ rank }: { rank: EquipmentRank }) {
  const { ceiling, probIncr, baseProb } = getShinyCeiling(rank);
  return (
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
  );
}
