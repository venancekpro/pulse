"use client";

import Link from "next/link";
import { LoadBadge } from "@/components/dashboard/LoadBadge";
import { POLE_LABELS } from "@/lib/constants";
import { useTeamData } from "@/hooks/useTeamData";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TeamListPage() {
  const { members, error } = useTeamData();

  if (error || !members) {
    return <p className="text-muted-foreground">{error ?? "Chargement…"}</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader label="Ressources" title="Équipe" description="Membres SDIVT et charge calculée." />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Pôle</TableHead>
            <TableHead>Charge</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Projets</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <Link
                  href={`/team/${m.id}`}
                  className="font-semibold text-foreground transition-colors hover:text-[var(--lumis-accent)]"
                >
                  {m.name}
                </Link>
              </TableCell>
              <TableCell>{POLE_LABELS[m.pole]}</TableCell>
              <TableCell>{m.calculatedLoad}%</TableCell>
              <TableCell>
                <LoadBadge level={m.loadLevel} />
              </TableCell>
              <TableCell>{m.projectCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
