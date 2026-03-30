"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { SkillsMatrix } from "@/components/skills/SkillsMatrix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Matrice de compétences" description="Vue d'ensemble des compétences de l'équipe" />
      <Card>
        <CardHeader>
          <CardTitle>Compétences par membre</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillsMatrix />
        </CardContent>
      </Card>
    </div>
  );
}
