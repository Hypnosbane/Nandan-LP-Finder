import { NextRequest, NextResponse } from "next/server";
import { getProviders } from "@/lib/providers";
import { logAudit } from "@/lib/audit";
import type { OrganizationSearchResult, ContactSearchResult } from "@/lib/providers";

const STOP_WORDS = new Set([
  "based", "in", "from", "at", "the", "a", "an", "and", "or", "of",
  "with", "for", "near", "around", "located", "operating", "who",
  "that", "are", "is", "have", "has", "fund", "funds", "company",
  "companies", "firm", "firms", "manager", "managers", "investor",
  "investors", "capital", "group", "limited", "pvt", "ltd",
]);

function parseQuery(raw: string): string[] {
  return raw
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function orgMatchesAllTerms(
  org: OrganizationSearchResult,
  terms: string[]
): boolean {
  const searchable = [
    org.name,
    org.industry,
    org.location,
    org.description,
    org.domain,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return terms.every((term) => searchable.includes(term));
}

function contactMatchesAllTerms(
  contact: ContactSearchResult,
  terms: string[]
): boolean {
  const searchable = [
    contact.name,
    contact.title,
    contact.organizationName,
    contact.email,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return terms.every((term) => searchable.includes(term));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query, titles } = body;

  if (!query) {
    return NextResponse.json(
      { error: "query is required" },
      { status: 400 }
    );
  }

  const terms = parseQuery(query);
  if (terms.length === 0) {
    return NextResponse.json({ organizations: [], contacts: [] });
  }

  const providers = getProviders();

  const allOrgs: (OrganizationSearchResult & { source: string })[] = [];
  const allContacts: (ContactSearchResult & { source: string })[] = [];

  const searchTerms = terms.length > 1 ? ["", ...terms] : terms;

  const promises = providers.flatMap((provider) =>
    searchTerms.flatMap((term) => [
      provider.searchOrganizations(term).then((orgs) => {
        for (const org of orgs) {
          allOrgs.push({ ...org, source: provider.name });
        }
      }),
      provider.searchContacts(term, titles).then((contacts) => {
        for (const contact of contacts) {
          allContacts.push({ ...contact, source: provider.name });
        }
      }),
    ])
  );

  await Promise.allSettled(promises);

  const seen = new Set<string>();
  const filteredOrgs = allOrgs.filter((org) => {
    if (!orgMatchesAllTerms(org, terms)) return false;
    const key = `${org.source}:${org.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const seenContacts = new Set<string>();
  const filteredContacts = allContacts.filter((contact) => {
    if (!contactMatchesAllTerms(contact, terms)) return false;
    const key = `${contact.source}:${contact.name}:${contact.organizationName}`;
    if (seenContacts.has(key)) return false;
    seenContacts.add(key);
    return true;
  });

  await logAudit({
    action: "search",
    entity: "provider",
    details: `Searched "${query}" (terms: ${terms.join(", ")}) across ${providers.map((p) => p.name).join(", ")}`,
  });

  return NextResponse.json({ organizations: filteredOrgs, contacts: filteredContacts });
}
