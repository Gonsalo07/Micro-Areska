import type { LucideIcon } from "lucide-react";

export function ButtonStartIcon({
  icon: Icon,
  size = 16,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  className?: string;
}) {
  return (
    <span className="flex shrink-0 items-center pe-1">
      <Icon size={size} className={className} strokeWidth={1.75} />
    </span>
  );
}
