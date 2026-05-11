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
    return (
      <div className="title-error">
        {"\u9019\u500b\u65b9\u584a\u4e0d\u6703\u8df3\u6846"}
      </div>
    );
  }

  if (!meta.rankUp[rank]) {
    return (
      <div className="title-error">
        {"\u9019\u500b\u65b9\u584a\u5728\u6b64\u968e\u7d1a\u4e0d\u6703\u8df3\u6846"}
      </div>
    );
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
          <TableHead>{"\u7d50\u679c"}</TableHead>
          <TableHead className="text-right">{"\u6a5f\u7387"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rankUpProbs.map((prob, i) => {
          const label =
            i === 0
              ? "\u7dad\u6301"
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
          <TableHead>{"\u57fa\u790e\u6a5f\u7387"}</TableHead>
          <TableHead>{"\u6bcf\u6b21\u589e\u52a0"}</TableHead>
          <TableHead>{"\u4fdd\u5e95\u6b21\u6578"}</TableHead>
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
