"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ReliabilityReport } from "@/components/reports/ReliabilityReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  const [tab, setTab] = useState("charge");

  return (
    <div className="space-y-6">
      <PageHeader
        label="Exports"
        title="Rapports"
        description="Synthèse charge équipe et fiabilité des estimations."
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="charge">Charge équipe</TabsTrigger>
          <TabsTrigger value="fiabilite">Fiabilité estimations</TabsTrigger>
        </TabsList>
        <TabsContent value="charge">
          <ReportGenerator />
        </TabsContent>
        <TabsContent value="fiabilite">
          <Card>
            <CardHeader>
              <CardTitle>Score de fiabilité des estimations</CardTitle>
            </CardHeader>
            <CardContent>
              <ReliabilityReport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
