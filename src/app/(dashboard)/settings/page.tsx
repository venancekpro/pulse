"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader label="Compte" title="Paramètres" description="Préférences et administration." />
      <PermissionGate permission="MANAGE_USERS" fallback={<AccessDenied />}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            La gestion fine des comptes (création / rôles) peut être branchée ici via une future
            interface d&apos;administration. Les comptes initiaux sont fournis par le script de seed
            Prisma.
          </CardContent>
        </Card>
      </PermissionGate>
    </div>
  );
}
