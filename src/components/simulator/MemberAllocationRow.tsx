"use client";

import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Slider,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
} from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadBadge } from "@/components/dashboard/LoadBadge";
import { loadLevelFromPercent } from "@/lib/utils/load-calculator";
import { ROLE_WEIGHT, LOAD_COLORS } from "@/lib/constants";
import type { MemberWithLoad, AssignmentRole } from "@/types";

interface MemberAllocationRowProps {
  member: MemberWithLoad;
  allocation: number;
  role: AssignmentRole;
  onAllocationChange: (value: number) => void;
  onRoleChange: (role: AssignmentRole) => void;
}

export function MemberAllocationRow({
  member,
  allocation,
  role,
  onAllocationChange,
  onRoleChange,
}: MemberAllocationRowProps) {
  const projectedLoad = useMemo(() => {
    const delta = allocation * ROLE_WEIGHT[role];
    return Math.round((member.calculatedLoad + delta) * 10) / 10;
  }, [allocation, role, member.calculatedLoad]);

  const projectedLevel = useMemo(
    () => loadLevelFromPercent(projectedLoad),
    [projectedLoad],
  );

  const indicatorColor = LOAD_COLORS[projectedLevel];

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
      {/* Nom membre */}
      <span className="w-28 shrink-0 truncate text-sm font-medium" title={member.name}>
        {member.name}
      </span>

      {/* Sélecteur rôle */}
      <Select
        value={role}
        onValueChange={(v) => v && onRoleChange(v as AssignmentRole)}
      >
        <SelectTrigger className="w-[110px] h-8 text-xs shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="contributeur">Contributeur</SelectItem>
          <SelectItem value="lead">Lead (×1.3)</SelectItem>
        </SelectContent>
      </Select>

      {/* Slider */}
      <div className="flex-1 min-w-[100px]">
        <Slider
          value={allocation}
          onValueChange={(v) => onAllocationChange(v as number)}
          min={0}
          max={100}
          step={5}
        >
          <SliderControl>
            <SliderTrack>
              <SliderIndicator style={{ backgroundColor: indicatorColor }} />
            </SliderTrack>
            <SliderThumb style={{ borderColor: indicatorColor }} />
          </SliderControl>
        </Slider>
      </div>

      {/* Input numérique */}
      <Input
        type="number"
        min={0}
        max={100}
        className="w-16 h-8 text-center text-xs tabular-nums"
        value={allocation || ""}
        onChange={(e) => {
          const v = Math.min(100, Math.max(0, Number(e.target.value) || 0));
          onAllocationChange(v);
        }}
        placeholder="0"
      />

      {/* Preview live */}
      <div className="flex items-center gap-1.5 w-52 shrink-0 justify-end text-sm">
        <span className="text-muted-foreground tabular-nums">{member.calculatedLoad}%</span>
        <ChevronRight className="size-3 text-muted-foreground shrink-0" />
        <span className="font-semibold tabular-nums" style={{ color: indicatorColor }}>
          {projectedLoad}%
        </span>
        <LoadBadge level={projectedLevel} />
      </div>
    </div>
  );
}
