"use client";

import { useState } from "react";

interface OrgResult {
  name: string;
  domain: string | null;
  industry: string | null;
  location: string | null;
  description: string | null;
  source: string;
  rawData: Record<string, unknown>;
}

interface ContactResult {
  name: string;
  title: string | null;
  email: string | null;
  emailConfidence: number;
  organizationName: string | null;
  source: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [orgs, setOrgs] = useState<OrgResult[]>([]);
  const [contacts, setContacts] = useState<ContactResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setOrgs(data.organizations || []);
      setContacts(data.contacts || []);
    } catch {
      setOrgs([]);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveOrganization(org: OrgResult) {
    setSaving(org.name);
    try {
      const rawData = org.rawData || {};
      await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: org.name,
          type: inferType(org),
          website: org.domain ? `https://${org.domain}` : null,
          country: "India",
          investmentFocus: rawData.knownAlternativeFocus || [],
          sourceUrls: rawData.sourceUrl ? [rawData.sourceUrl] : [],
        }),
      });
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Search LPs</h1>
        <p className="text-[var(--muted)] mt-1">
          Search across SEBI AIFs, Indian family offices, insurance companies, pension funds, and more.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: family office, credit, insurance, PE fund, Mumbai..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["family office", "credit", "PE fund", "insurance", "pension", "Mumbai", "Bengaluru"].map(
          (tag) => (
            <button
              key={tag}
              onClick={() => { setQuery(tag); }}
              className="px-3 py-1 text-sm rounded-full border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              {tag}
            </button>
          )
        )}
      </div>

      {searched && !loading && (
        <div className="mb-4 text-sm text-[var(--muted)]">
          Found {orgs.length} organizations and {contacts.length} contacts
        </div>
      )}

      {orgs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Organizations</h2>
          <div className="space-y-3">
            {orgs.map((org, i) => (
              <div
                key={`${org.name}-${i}`}
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{org.name}</h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--background)] text-[var(--muted)] border border-[var(--border)]">
                        {org.source}
                      </span>
                    </div>
                    {org.industry && (
                      <p className="text-sm text-[var(--primary)] mt-0.5">{org.industry}</p>
                    )}
                    {org.location && (
                      <p className="text-sm text-[var(--muted)] mt-0.5">{org.location}</p>
                    )}
                    {org.description && (
                      <p className="text-sm text-[var(--muted)] mt-1">{org.description}</p>
                    )}
                    {org.domain && (
                      <p className="text-sm mt-1">
                        <span className="text-[var(--muted)]">Website: </span>
                        <span className="text-[var(--primary)]">{org.domain}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => saveOrganization(org)}
                    disabled={saving === org.name}
                    className="shrink-0 px-3 py-1.5 text-sm rounded-md border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 transition-colors"
                  >
                    {saving === org.name ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contacts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Contacts</h2>
          <div className="space-y-3">
            {contacts.map((contact, i) => (
              <div
                key={`${contact.name}-${i}`}
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{contact.name}</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--background)] text-[var(--muted)] border border-[var(--border)]">
                    {contact.source}
                  </span>
                </div>
                {contact.title && (
                  <p className="text-sm text-[var(--muted)]">{contact.title}</p>
                )}
                {contact.organizationName && (
                  <p className="text-sm text-[var(--muted)]">{contact.organizationName}</p>
                )}
                {contact.email && (
                  <p className="text-sm mt-1">
                    <span className="text-[var(--muted)]">Email: </span>
                    {contact.email}
                    <span className="ml-2 text-xs text-[var(--muted)]">
                      ({contact.emailConfidence}% confidence)
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {searched && !loading && orgs.length === 0 && contacts.length === 0 && (
        <div className="text-center py-12 text-[var(--muted)]">
          No results found for &ldquo;{query}&rdquo;. Try a different search term.
        </div>
      )}
    </div>
  );
}

function inferType(org: OrgResult): string {
  const industry = (org.industry || "").toLowerCase();
  if (industry.includes("family")) return "family_office";
  if (industry.includes("insurance")) return "insurance";
  if (industry.includes("pension")) return "pension_fund";
  if (industry.includes("aif")) return "aif";
  if (industry.includes("pms")) return "pms";
  if (industry.includes("dfi")) return "dfi";
  if (industry.includes("nbfc")) return "nbfc";
  return "other";
}
