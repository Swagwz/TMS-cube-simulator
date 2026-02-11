import React from "react";

type Props = {
  counter: React.ReactNode;
  children: React.ReactNode;
};

export default function EnhancerFooter({ counter, children }: Props) {
  return (
    <div className="flex flex-row items-end justify-between gap-2">
      {counter}
      <div className="flex flex-row flex-wrap-reverse items-center justify-end gap-2">
        {children}
      </div>
    </div>
  );
}
