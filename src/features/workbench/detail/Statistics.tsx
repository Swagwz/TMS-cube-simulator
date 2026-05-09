import { memo } from "react";
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

const formattedCost = new Intl.NumberFormat("zh-tw", {
  style: "currency",
  currency: "TWD",
  currencyDisplay: "symbol",
  minimumFractionDigits: 0,
});

const formattedCount = new Intl.NumberFormat("zh-tw", {
  minimumFractionDigits: 0,
});

export type StatisticsRow = {
  id: string;
  display: string;
  count: number;
  price: number;
  discount: number;
};

type Props = {
  rows: StatisticsRow[];
};

function Statistics({ rows }: Props) {
  const totalCost = rows.reduce(
    (acc, { price, count, discount }) =>
      acc + ((price * (100 - discount)) / 100) * count,
    0,
  );

  return (
    <Table>
      <TableCaption className="text-glass-foreground">�ϥβέp</TableCaption>
      <TableHeader className="bg-secondary-dark text-secondary-dark-foreground">
        <TableRow>
          <TableHead className="w-[30%] text-inherit">�D��</TableHead>
          <TableHead className="w-[35%] text-inherit">����</TableHead>
          <TableHead className="w-[35%] text-right text-inherit">
            �ϥΦ���
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
              �`��O
              <InfoPopover>����w�M�Χ馩�C</InfoPopover>
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
