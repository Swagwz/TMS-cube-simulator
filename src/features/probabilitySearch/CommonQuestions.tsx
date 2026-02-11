import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";
import React from "react";

const questions = [
  {
    q: "機率來源為何？",
    a: (
      <p>
        從官網公布資料整理，
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
    q: "權重來源為何？",
    a: <p>根據公布的機率回推。</p>,
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
    <Accordion
      type="single"
      collapsible
      className="bg-primary/10 mt-4 rounded-xl p-2"
    >
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
