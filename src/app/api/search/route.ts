import { NextRequest, NextResponse } from "next/server";
import { getProviders } from "@/lib/providers";
import { logAudit } from "@/lib/audit";
import type { OrganizationSearchResult, ContactSearchResult } from "@/lib/providers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query, titles } = body;

  if (!query) {
    return NextResponse.json(
      { error: "query is required" },
      { status: 400 }
    );
  }

  const providers = getProviders();

  const allOrgs: (OrganizationSearchResult & { source: string })[] = [];
  const allContacts: (ContactSearchResult & { source: string })[] = [];

  const promises = providers.flatMap((provider) => [
    provider.searchOrganizations(query).then((orgs) => {
      for (const org of orgs) {
        allOrgs.push({ ...org, source: provider.name });
      }
    }),
    provider.searchContacts(query, titles).then((contacts) => {
      for (const contact of contacts) {
        allContacts.push({ ...contact, source: provider.name });
      }
    }),
  ]);

  await Promise.allSettled(promises);

  await logAudit({
    action: "search",
    entity: "provider",
    details: `Searched "${query}" across ${providers.map((p) => p.name).join(", ")}`,
  });

  return NextResponse.json({ organizations: allOrgs, contacts: allContacts });
}
