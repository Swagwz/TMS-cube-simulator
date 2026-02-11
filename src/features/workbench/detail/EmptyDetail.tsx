import { Empty, EmptyDescription, EmptyHeader } from "@/components/ui/empty";

export default function EmptyDetail() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyDescription className="text-gray-200">
          請先選取裝備/萌獸
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
