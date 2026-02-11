import { useState } from "react";

import EquipmentList from "./equipmentList/EquipmentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MoeList from "./moeList/MoeList";
import { Button } from "@/components/ui/button";

const TABS_CONFIG = [
  {
    label: "裝備列表",
    value: "equipment-list",
    content: <EquipmentList />,
  },
  {
    label: "萌獸列表",
    value: "moe-list",
    content: <MoeList />,
  },
] as const;

type Tab = (typeof TABS_CONFIG)[number]["value"];

export default function Setting() {
  const [currentTab, setCurrentTab] = useState<Tab>(TABS_CONFIG[0].value);

  const handleChangeTab = (value: string) => setCurrentTab(value as Tab);

  return (
    <div className="col-span-1">
      <Tabs
        value={currentTab}
        onValueChange={handleChangeTab}
        className="mx-auto max-w-lg"
      >
        <TabsList variant="glass" className="gap-2">
          {TABS_CONFIG.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} variant="glass" asChild>
              <Button
                variant={"ghost"}
                className="hover:bg-muted/50 transition-all"
              >
                {label}
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
