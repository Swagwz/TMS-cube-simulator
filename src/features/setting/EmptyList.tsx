import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";
import { CreateMoeContextProvider } from "@/contexts/useCreateMoeContext";
import { CreateEquipmentProvider } from "@/contexts/useCreateEquipmentContext";
import CreateEquipmentModal from "./equipmentList/createEquipmentModal/CreateEquipmentModal";
import CreateMoeModal from "./moeList/createMoeModal/CreateMoeModal";

const EMPTY_CONFIG = {
  equipment: {
    description: "新增並設定裝備素質",
    Provider: CreateEquipmentProvider,
    Modal: CreateEquipmentModal,
  },
  moe: {
    description: "新增並設定萌獸素質",
    Provider: CreateMoeContextProvider,
    Modal: CreateMoeModal,
  },
} as const;

type EmptyType = keyof typeof EMPTY_CONFIG;

export default function EmptyList({ type }: { type: EmptyType }) {
  const { description, Provider, Modal } = EMPTY_CONFIG[type];
  return (
    <Empty>
      <EmptyHeader>
        <EmptyDescription className="text-glass-foreground">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Provider>
          <Modal />
        </Provider>
      </EmptyContent>
    </Empty>
  );
}
