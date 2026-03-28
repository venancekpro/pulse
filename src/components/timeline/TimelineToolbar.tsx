"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { POLE_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { ZoomLevel, TimelineFilters } from "./types";
import type { Pole, ProjectStatus } from "@/types";

interface TimelineToolbarProps {
  zoom: ZoomLevel;
  onZoomChange: (zoom: ZoomLevel) => void;
  filters: TimelineFilters;
  onFiltersChange: (filters: TimelineFilters) => void;
}

export function TimelineToolbar({
  zoom,
  onZoomChange,
  filters,
  onFiltersChange,
}: TimelineToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tabs
        value={zoom}
        onValueChange={(v: string | number | null) => {
          if (v) onZoomChange(v as ZoomLevel);
        }}
      >
        <TabsList>
          <TabsTrigger value="month">Mois</TabsTrigger>
          <TabsTrigger value="quarter">Trimestre</TabsTrigger>
          <TabsTrigger value="year">Année</TabsTrigger>
        </TabsList>
      </Tabs>

      <Select
        value={filters.pole}
        onValueChange={(v: string | number | null) => {
          if (v) onFiltersChange({ ...filters, pole: v as Pole | "all" });
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les pôles</SelectItem>
          {Object.entries(POLE_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(v: string | number | null) => {
          if (v) onFiltersChange({ ...filters, status: v as ProjectStatus | "all" });
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {Object.entries(STATUS_LABELS)
            .filter(([k]) => k !== "livre")
            .map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
