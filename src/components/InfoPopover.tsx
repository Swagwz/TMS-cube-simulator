import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

type InfoTooltipProps = {
  children: React.ReactNode;
};

export default function InfoPopover({ children }: InfoTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon-xs"}
          className="hover:bg-transparent hover:text-inherit"
        >
          <Info />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit max-w-72 text-sm">
        {children}
      </PopoverContent>
    </Popover>
  );
}
