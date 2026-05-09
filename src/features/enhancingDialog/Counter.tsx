import EhmCell from "../workbench/enhancement/availableEhmList/EhmCell";

type Props = {
  items: {
    id: string;
    name: string;
    imagePath: string;
    count: number;
  }[];
};

export default function Counter({ items }: Props) {
  return (
    <div className="bg-glass-lighter flex flex-row gap-2 rounded-lg p-2">
      {items.map((item) => (
        <EhmCell
          key={item.id}
          name={item.name}
          imagePath={item.imagePath}
          count={item.count}
        />
      ))}
    </div>
  );
}
