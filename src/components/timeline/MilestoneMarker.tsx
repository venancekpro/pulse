"use client";

export function MilestoneMarker({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center text-xs text-muted-foreground">
      <div className="h-6 w-px bg-border" />
      <span className="mt-1 whitespace-nowrap rotate-0">{label}</span>
    </div>
  );
}
