import React from "react";
import { Trash } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProbabilityDisplay } from "@/components/ProbabilityDisplay";

const accordionItemVariants = cva("rounded-md px-2", {
  variants: {
    variant: {
      glass:
        "bg-glass-light/50 data-[state=open]:bg-glass-light/70 border-none",
      paper: "bg-secondary-main border",
    },
  },
  defaultVariants: {
    variant: "glass",
  },
});

const accordionTriggerVariants = cva("py-2 hover:no-underline", {
  variants: {
    variant: {
      glass: "[&>svg]:text-glass-foreground",
      paper: "[&>svg]:text-secondary-main-foreground",
    },
  },
  defaultVariants: {
    variant: "glass",
  },
});

const headerTextVariants = cva("flex items-center gap-2 text-sm font-medium", {
  variants: {
    variant: {
      glass: "text-glass-foreground hover:text-white",
      paper: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "glass",
  },
});

const deleteButtonVariants = cva("hover:text-destructive h-6 w-6", {
  variants: {
    variant: {
      glass: "text-glass-foreground",
      paper: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "glass",
  },
});

type Props<T> = {
  targets: T[];
  onDelete: (index: number) => void;
  getProb: (target: T, index: number) => number;
  children: (target: T, index: number) => React.ReactNode;
} & VariantProps<typeof accordionItemVariants>;

export default function TargetAccordion<T>({
  targets,
  onDelete,
  getProb,
  children,
  variant = "glass",
}: Props<T>) {
  return (
    <Accordion
      type="multiple"
      className="flex flex-col gap-2"
      defaultValue={targets.map((_, i) => `item-${i}`)}
    >
      {targets.map((target, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className={cn(accordionItemVariants({ variant }))}
        >
          <AccordionTrigger
            className={cn(accordionTriggerVariants({ variant }))}
          >
            <div className="mr-2 flex flex-1 items-center justify-between">
              <div className={cn(headerTextVariants({ variant }))}>
                <span>組合 {index + 1}</span>
                <ProbabilityDisplay prob={getProb(target, index)} />
              </div>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={cn(deleteButtonVariants({ variant }))}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(index);
                }}
              >
                <span role="button">
                  <Trash className="h-3 w-3" />
                </span>
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            {children(target, index)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
