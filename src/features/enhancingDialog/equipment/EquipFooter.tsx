import React from "react";
import EnhancerFooter from "../EnhancerFooter";
import EquipCounter from "./EquipCounter";

type Props = {
  children: React.ReactNode;
};

export default function EquipFooter({ children }: Props) {
  return <EnhancerFooter counter={<EquipCounter />}>{children}</EnhancerFooter>;
}
