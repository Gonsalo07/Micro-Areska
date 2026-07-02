import type { LucideIcon } from "lucide-react";

export function InputIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="pointer-events-none flex items-center text-default-400">
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
    </div>
  );
}
