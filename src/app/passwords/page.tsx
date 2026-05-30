"use client";

import { AppShell } from "@/components/AppShell";
import { ResourcePage } from "@/components/ResourcePage";

export default function PasswordsPage() {
  return (
    <AppShell>
      <ResourcePage
        title="Manage Passwords"
        description="Review and add vault items without exposing encrypted values or hashes."
        endpoint="/api/passwords"
        listKey="passwords"
        submitLabel="Create"
        fields={[
          { name: "platformName", label: "Platform", required: true },
          { name: "websiteUrl", label: "Website URL", required: true },
          { name: "username", label: "Username" },
          { name: "email", label: "Email" },
          { name: "phone", label: "Phone" },
          { name: "password", label: "Password", type: "password", required: true },
        ]}
      />
    </AppShell>
  );
}
