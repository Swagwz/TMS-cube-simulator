export function CollapsibleDetail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details>
      <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-center transition-colors">
        {title}
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
