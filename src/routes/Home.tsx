import { cn } from "@/lib/utils";
import Setting from "@/features/setting/Setting";
import Workbench from "@/features/workbench/Workbench";

export default function Home() {
  return (
    <main
      className={cn(
        "container mx-auto",
        "min-h-screen p-2",
        "grid grid-cols-1 gap-4 md:grid-cols-2",
        "place-content-start",
      )}
    >
      <Workbench />
      <Setting />
    </main>
  );
}
