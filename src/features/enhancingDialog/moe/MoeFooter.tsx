import React from "react";
import EnhancerFooter from "../EnhancerFooter";
import MoeCounter from "./MoeCounter";

type Props = { children: React.ReactNode };

export default function MoeFooter({ children }: Props) {
  return <EnhancerFooter counter={<MoeCounter />}>{children}</EnhancerFooter>;
}
