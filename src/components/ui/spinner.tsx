import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className, size = "default" }: { className?: string; size?: "sm" | "default" | "lg" }) {
  const sizeCls =
    size === "sm" ? "size-3.5" : size === "lg" ? "size-6" : "size-4";
  return (
    <Loader2
      className={cn("animate-spin text-current opacity-90", sizeCls, className)}
      aria-hidden
    />
  );
}
