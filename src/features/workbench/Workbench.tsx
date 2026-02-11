import { useEffect, useState } from "react";
import { FileText, Hammer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Detail from "./detail/Detail";
import Enhancement from "./enhancement/Enhancement";
import { useActiveStore } from "@/store/useActiveStore";

const TABS_CONFIG = [
  {
    icon: <FileText />,
    label: "詳細資料",
    value: "detail",
    content: <Detail />,
  },
  {
    icon: <Hammer />,
    label: "裝備強化",
    value: "manual",
    content: <Enhancement />,
  },
] as const;

type Tab = (typeof TABS_CONFIG)[number]["value"];

export default function Workbench() {
  const hasActive = useActiveStore((s) => !!s.activeState.activeType);
  const [currentTab, setCurrentTab] = useState<Tab>(TABS_CONFIG[0].value);

  const handleChangeTab = (value: string) => setCurrentTab(value as Tab);

  useEffect(() => {
    if (!hasActive) setCurrentTab("detail");
  }, [hasActive]);

  return (
    <div className="col-span-1">
      <Tabs
        value={currentTab}
        onValueChange={handleChangeTab}
        className="mx-auto max-w-lg"
      >
        <TabsList variant="glass" className="gap-2">
          {TABS_CONFIG.map(({ value, label, icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              variant="glass"
              className="w-full"
              asChild
              disabled={!hasActive}
            >
              <Button
                variant={"ghost"}
                className="hover:bg-muted/50 transition-all dark:bg-red-600!"
              >
                {icon}
                <span className="hidden md:block">{label}</span>
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS_CONFIG.map(({ value, label, content }) => (
          <TabsContent key={value} value={value}>
            <Card className="bg-glass text-glass-foreground">
              <CardHeader>
                <CardTitle>{label}</CardTitle>
              </CardHeader>
              <CardContent>{content}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
