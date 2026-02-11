import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

const TabListVariants = cva(
  "inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground ",
        glass: "bg-glass",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof TabListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(TabListVariants({ variant }), className)}
      {...props}
    />
  );
}

const TabsTriggerVariants = cva(
  "cursor-pointer data-[state=active]:bg-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=active]:bg-input/30 focus-visible:outline-ring dark:data-[state=active]:border-input inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "text-foreground dark:text-muted-foreground  dark:data-[state=active]:text-foreground ",
        glass:
          "text-glass-foreground  data-[state=active]:text-black dark:bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsTrigger({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof TabsTriggerVariants>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(TabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
