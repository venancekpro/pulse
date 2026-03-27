"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ReportRow = {
  member: string;
  pole: string;
  calculatedLoad: number;
  loadLevel: string;
  projectCount: number;
  iso: string | null;
};

export function ReportPreview({ rows }: { rows: ReportRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Membre</TableHead>
          <TableHead>Pôle</TableHead>
          <TableHead>Charge %</TableHead>
          <TableHead>Niveau</TableHead>
          <TableHead>Projets</TableHead>
          <TableHead>ISO</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.member}>
            <TableCell className="font-medium">{r.member}</TableCell>
            <TableCell>{r.pole}</TableCell>
            <TableCell>{r.calculatedLoad}</TableCell>
            <TableCell className="capitalize">{r.loadLevel}</TableCell>
            <TableCell>{r.projectCount}</TableCell>
            <TableCell>{r.iso ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
