import SearchForm from "@/features/probabilitySearch/SearchForm";
import { cn } from "@/lib/utils";

export default function ProbabilitySearch() {
  return (
    <main
      className={cn(
        "container mx-auto",
        "min-h-screen p-2",
        "flex justify-center",
      )}
    >
      <SearchForm />
    </main>
  );
}
