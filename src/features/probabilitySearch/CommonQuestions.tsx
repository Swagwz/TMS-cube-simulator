import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const questions = [
  {
    q: "機率／權重來源為何？",
    a: (
      <p>
        機率從官網公布資料整理；權重則根據公布的機率回推。
        <br />
        沒標示的機率由
        <a
          href="https://maplestory.nexon.com/Guide/OtherProbability/cube/artisan#a"
          target="_blank"
          rel="noreferrer noopener"
          className="text-blue-500 underline"
        >
          KMS方塊機率查詢
        </a>
        推測。
      </p>
    ),
  },
  {
    q: "跳框機率和潛能機率有什麼差別？",
    a: (
      <p>
        跳框機率是先判斷裝備潛能階級是否提升；潛能機率是決定每一排實際抽到哪一條潛能。
        <br />
        也就是說，先決定這次結果是同階、跳下一階或跳更多階，接著才依照結果階級抽潛能。
      </p>
    ),
  },
  {
    q: "跳框加倍是怎麼計算的？",
    a: (
      <div className="flex flex-col gap-3">
        <p>
          只有跳下一階會套用加倍，跳兩階以上不會套用。下面用簡單英文代表各項權重：
        </p>
        <p>
          <code>next</code>：跳下一階權重
          <br />
          <code>other</code>：跳兩階以上權重合計
          <br />
          <code>x</code>：加倍倍率
        </p>
        <p>
          <code>sum = next * x + other</code>
          <br />
          <code>same = max(100 - sum, 0)</code>
          <br />
          <span className="text-muted-foreground text-xs">
            sum 超過 100 時 same 為 0；沒超過時 same 為 100 - sum。
          </span>
          <br />
          <code>顯示機率 = 該結果權重 / (same + sum)</code>
        </p>
        <RankUpMultiplierExampleTable />
      </div>
    ),
  },
  {
    q: "跳框加倍會影響跳兩階、跳三階嗎？",
    a: (
      <p>
        不會。跳框加倍只會套用在「跳下一階」的權重，跳兩階以上的權重會維持原本數值。
        <br />
        例如恢復方塊特殊階級 x2 時，升稀有會加倍，但升罕見、升傳說不會加倍。
      </p>
    ),
  },
  {
    q: "閃亮附加方塊為什麼和其他方塊不同？",
    a: (
      <p>
        閃亮附加方塊使用獨立的跳框規則：每次未跳框會提高下一次跳框機率，並且有保底次數。
        <br />
        因此它不套用一般方塊的跳框加倍公式。
      </p>
    ),
  },
  {
    q: "表中機率是如何計算的？",
    a: (
      <p>
        根據方塊的每排潛能機率(同階級、下一階級) * 該階級可套用潛能的權重 /
        該階級全部可套用潛能的權重。
        <br />
        可套用的潛能為：裝備等級 {">="} 該潛能最低需求等級。
      </p>
    ),
  },
  {
    q: "為什麼同一條潛能在不同條件下機率不同？",
    a: (
      <p>
        因為可抽到的潛能池會受到裝備種類、裝備等級、主潛能或附加潛能、目前階級和方塊種類影響。
        <br />
        有些方塊也會特別調整某條潛能的權重，所以同一條潛能在不同方塊或不同條件下，最後顯示機率可能不同。
      </p>
    ),
  },
  {
    q: "為什麼有些潛能機率是 0%？",
    a: (
      <p>
        該潛能受到方塊每排階級機率影響導致。
        <br />
        <span className="text-muted-foreground text-xs">
          (例如：恢復方塊第一排同階級100%、下一階級0%。)
        </span>
      </p>
    ),
  },
];

export default function CommonQuestions() {
  return (
    <Accordion type="multiple" className="bg-primary/10 mt-4 rounded-xl p-2">
      {questions.map(({ q, a }) => (
        <QuestionItem key={q} q={q} a={a} />
      ))}
    </Accordion>
  );
}

type Props = { q: string; a: string | React.ReactNode };

function QuestionItem({ q, a }: Props) {
  return (
    <AccordionItem value={q}>
      <AccordionTrigger>{q}</AccordionTrigger>
      <AccordionContent className="px-2">{a}</AccordionContent>
    </AccordionItem>
  );
}

function RankUpMultiplierExampleTable() {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border border-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>目前階級</TableHead>
              <TableHead>結果</TableHead>
              <TableHead className="text-right">權重</TableHead>
              <TableHead className="text-right">機率</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">特殊</TableCell>
              <TableCell>同階</TableCell>
              <TableCell className="text-right">0</TableCell>
              <TableCell className="text-right">0%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">特殊</TableCell>
              <TableCell>升稀有</TableCell>
              <TableCell className="text-right">97.7 * 2 = 195.4</TableCell>
              <TableCell className="text-right">
                195.4 / 197.7 = 98.84%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">特殊</TableCell>
              <TableCell>升罕見</TableCell>
              <TableCell className="text-right">2</TableCell>
              <TableCell className="text-right">2 / 197.7 = 1.01%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">特殊</TableCell>
              <TableCell>升傳說</TableCell>
              <TableCell className="text-right">0.3</TableCell>
              <TableCell className="text-right">0.3 / 197.7 = 0.15%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">稀有</TableCell>
              <TableCell>同階</TableCell>
              <TableCell className="text-right">100 - 16.6 = 83.4</TableCell>
              <TableCell className="text-right">83.4%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">稀有</TableCell>
              <TableCell>升罕見</TableCell>
              <TableCell className="text-right">8 * 2 = 16</TableCell>
              <TableCell className="text-right">16%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">稀有</TableCell>
              <TableCell>升傳說</TableCell>
              <TableCell className="text-right">0.6</TableCell>
              <TableCell className="text-right">0.6%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
