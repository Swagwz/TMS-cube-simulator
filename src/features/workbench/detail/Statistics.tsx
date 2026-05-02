import { memo, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InfoPopover from "@/components/InfoPopover";
import type { EhmId } from "@/domains/enhancement/enhancement.type";
import type { MoeInstance } from "@/store/useMoeStore";
import type { EquipmentInstance } from "@/store/useEquipmentStore";
import { EnhancementManager } from "@/domains/enhancement/enhancementManager";
import { typedEntries } from "@/lib/utils";
import { MOE_CUBE_LIST } from "@/domains/enhancement/moe/moe.config";
import { SOUL_LIST } from "@/domains/enhancement/soul/soul.config";
import { CubeRegistry } from "@/domains/cube";

const formattedCost = new Intl.NumberFormat("zh-tw", {
  style: "currency",
  currency: "TWD",
  currencyDisplay: "symbol",
  minimumFractionDigits: 0,
});

const formattedCount = new Intl.NumberFormat("zh-tw", {
  minimumFractionDigits: 0,
});

type Props = {
  statistics: MoeInstance["statistics"] | EquipmentInstance["statistics"];
};

function Statistics({ statistics }: Props) {
  const rows = useMemo(() => {
    const rst: {
      id: string;
      display: string;
      count: number;
      price: number;
      discount: number;
    }[] = [];

    Object.values(statistics).forEach((record) => {
      typedEntries(record as Record<string, number>).forEach(([id, count]) => {
        if (!count) return;
        const { price, discount, name } = EnhancementManager.getItem(
          id as EhmId,
        );
        rst.push({ id, display: name, count, price, discount });
      });
    });

    const referenceOrder = [
      ...CubeRegistry.getAll().map(({ cubeId }) => cubeId),
      ...MOE_CUBE_LIST.map(({ id }) => id),
      ...SOUL_LIST.map(({ id }) => id),
    ];

    return rst.sort(
      (a, b) =>
        referenceOrder.indexOf(a.id as any) -
        referenceOrder.indexOf(b.id as any),
    );
  }, [statistics]);

  const totalCost = rows.reduce(
    (acc, { price, count, discount }) =>
      acc + ((price * (100 - discount)) / 100) * count,
    0,
  );

  // if (rows.length === 0) return null;

  return (
    <Table>
      <TableCaption className="text-glass-foreground">統計資料</TableCaption>
      <TableHeader className="bg-secondary-dark text-secondary-dark-foreground">
        <TableRow>
          <TableHead className="w-[30%] text-inherit">名稱</TableHead>
          <TableHead className="w-[35%] text-inherit">售價</TableHead>
          <TableHead className="w-[35%] text-right text-inherit">
            使用次數
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-secondary-lightest text-secondary-lightest-foreground">
        {rows.map(({ id, display, count, price, discount }) => (
          <TableRow key={id}>
            <TableCell className="font-medium">{display}</TableCell>
            <TableCell>
              {formattedCost.format(price * (1 - discount / 100))}
            </TableCell>
            <TableCell className="text-right">
              {formattedCount.format(count)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="bg-secondary-main text-secondary-main-foreground">
        <TableRow>
          <TableCell colSpan={2}>
            <div className="flex flex-row items-center">
              總花費
              <InfoPopover>已扣除商城優惠</InfoPopover>
            </div>
          </TableCell>
          <TableCell className="text-right">
            {formattedCost.format(totalCost)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default memo(Statistics);
