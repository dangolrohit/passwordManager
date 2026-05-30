"use client";

import { AppShell } from "@/components/AppShell";
import { ResourcePage } from "@/components/ResourcePage";

export default function FamilyPage() {
  return (
    <AppShell>
      <ResourcePage
        title="Manage Family"
        description="Add family members that can receive password assignments and one-time API keys."
        endpoint="/api/family"
        listKey="family"
        submitLabel="Add Member"
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "email", label: "Email", type: "email" },
          { name: "relation", label: "Relation", required: true },
        ]}
      />
    </AppShell>
  );
}
