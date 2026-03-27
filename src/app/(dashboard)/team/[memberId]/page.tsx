"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MemberDetail } from "@/components/team/MemberDetail";
import type { MemberWithLoad } from "@/types";

export default function MemberDetailPage() {
  const params = useParams();
  const id = params.memberId as string;
  const [member, setMember] = useState<MemberWithLoad | null>(null);

  async function load() {
    const res = await fetch(`/api/members/${id}`);
    if (!res.ok) {
      setMember(null);
      return;
    }
    const json = (await res.json()) as { data: MemberWithLoad };
    setMember(json.data);
  }

  useEffect(() => {
    void load();
  }, [id]);

  if (!member) {
    return <p className="text-muted-foreground">Chargement ou membre introuvable…</p>;
  }

  return <MemberDetail member={member} onReload={() => void load()} />;
}
