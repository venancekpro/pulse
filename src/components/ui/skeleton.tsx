import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50 dark:from-white/[0.04] dark:via-white/[0.09] dark:to-white/[0.04]",
        "bg-[length:200%_100%] animate-[pulse-shimmer_2s_ease-in-out_infinite]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
