"use client";
import type { DependencyEdge } from "@/types";

interface DependencyGraphProps {
  edges: DependencyEdge[];
}

export function DependencyGraph({ edges }: DependencyGraphProps) {
  if (edges.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8">Aucune donnée</div>;
  }

  const members = [...new Map(edges.map((e) => [e.source, e.sourceName])).entries()];
  const projects = [...new Map(edges.map((e) => [e.target, e.targetName])).entries()];

  const width = 800;
  const memberSpacing = Math.max(50, Math.min(80, 500 / members.length));
  const projectSpacing = Math.max(50, Math.min(80, 500 / projects.length));
  const height = Math.max(members.length * memberSpacing, projects.length * projectSpacing) + 60;

  const memberX = 120;
  const projectX = width - 120;

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="font-sans">
        {edges.map((edge, i) => {
          const mIdx = members.findIndex(([id]) => id === edge.source);
          const pIdx = projects.findIndex(([id]) => id === edge.target);
          const mY = 30 + mIdx * memberSpacing + memberSpacing / 2;
          const pY = 30 + pIdx * projectSpacing + projectSpacing / 2;
          const strokeWidth = Math.max(1, Math.min(4, edge.allocation / 25));
          const color = edge.isSoleMember ? "#DC2626" : "#94A3B8";
          const opacity = edge.isSoleMember ? 0.7 : 0.3;
          return <line key={i} x1={memberX + 60} y1={mY} x2={projectX - 60} y2={pY} stroke={color} strokeWidth={strokeWidth} opacity={opacity} />;
        })}
        {members.map(([id, name], i) => {
          const y = 30 + i * memberSpacing + memberSpacing / 2;
          const hasSolo = edges.some((e) => e.source === id && e.isSoleMember);
          return (
            <g key={id}>
              <circle cx={memberX} cy={y} r={16} fill={hasSolo ? "#DC262620" : "#3B82F620"} stroke={hasSolo ? "#DC2626" : "#3B82F6"} strokeWidth={1.5} />
              <text x={memberX} y={y + 4} textAnchor="middle" className="text-[10px] fill-foreground">{name.split(" ")[0]}</text>
            </g>
          );
        })}
        {projects.map(([id, name], i) => {
          const y = 30 + i * projectSpacing + projectSpacing / 2;
          const hasSolo = edges.some((e) => e.target === id && e.isSoleMember);
          return (
            <g key={id}>
              <rect x={projectX - 50} y={y - 14} width={100} height={28} rx={4} fill={hasSolo ? "#DC262610" : "#10B98110"} stroke={hasSolo ? "#DC2626" : "#10B981"} strokeWidth={1} />
              <text x={projectX} y={y + 4} textAnchor="middle" className="text-[10px] fill-foreground">{name.length > 12 ? name.slice(0, 12) + "..." : name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
