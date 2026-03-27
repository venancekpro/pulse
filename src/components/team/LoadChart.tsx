"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LOAD_COLORS } from "@/lib/constants";
import type { LoadLevel } from "@/types";

export function LoadChart({ load, level }: { load: number; level: LoadLevel }) {
  const data = [{ name: "Charge", value: Math.min(load, 120), fill: LOAD_COLORS[level] }];
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis type="number" domain={[0, 120]} className="text-xs" />
          <YAxis type="category" dataKey="name" width={56} className="text-xs" />
          <Tooltip formatter={(v) => [`${typeof v === "number" ? v : 0}%`, "Charge"]} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
