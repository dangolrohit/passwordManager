"use client";

import { AppShell } from "@/components/AppShell";
import { ResourcePage } from "@/components/ResourcePage";

export default function AddPasswordPage() {
  return (
    <AppShell>
      <ResourcePage
        title="Add Password"
        description="Create an encrypted vault item. Plain secrets are encrypted before storage."
        endpoint="/api/passwords"
        listKey="passwords"
        submitLabel="Save Password"
        fields={[
          { name: "platformName", label: "Platform", required: true },
          { name: "websiteUrl", label: "Website URL", required: true },
          { name: "username", label: "Username" },
          { name: "email", label: "Email" },
          { name: "phone", label: "Phone" },
          { name: "password", label: "Password", type: "password", required: true },
          { name: "notes", label: "Notes", textarea: true },
        ]}
      />
    </AppShell>
  );
}
