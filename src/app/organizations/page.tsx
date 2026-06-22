"use client";

import { useEffect, useState } from "react";

interface Organization {
  id: string;
  name: string;
  type: string;
  website: string | null;
  aum: number | null;
  country: string | null;
  investmentFocus: string[];
  score: number | null;
  contacts: { id: string; name: string; title: string | null; email: string | null }[];
  createdAt: string;
}

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then((data) => setOrgs(Array.isArray(data) ? data : []))
      .catch(() => setOrgs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orgs.filter(
    (org) =>
      org.name.toLowerCase().includes(filter.toLowerCase()) ||
      org.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-[var(--muted)] mt-1">
            {orgs.length} organizations saved
          </p>
        </div>
      </div>

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by name or type..."
        className="w-full max-w-md px-4 py-2.5 mb-6 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
      />

      {loading ? (
        <div className="text-[var(--muted)] py-12 text-center">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--muted)]">
            {orgs.length === 0
              ? "No organizations saved yet. Use Search to find and save LPs."
              : "No organizations match your filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">Organization</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">Type</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">Score</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">Contacts</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">Focus</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">Added</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((org) => (
                <tr key={org.id} className="border-b border-[var(--border)] hover:bg-[var(--background)] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium">{org.name}</div>
                    {org.website && (
                      <div className="text-xs text-[var(--muted)]">{org.website}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <TypeBadge type={org.type} />
                  </td>
                  <td className="py-3 px-4">
                    <ScoreBadge score={org.score ?? 0} />
                  </td>
                  <td className="py-3 px-4 text-[var(--muted)]">
                    {org.contacts.length}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {org.investmentFocus.slice(0, 3).map((f) => (
                        <span key={f} className="px-2 py-0.5 text-xs rounded-full bg-[var(--background)] text-[var(--muted)] border border-[var(--border)]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--muted)]">
                    {new Date(org.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    family_office: "Family Office",
    aif: "AIF",
    pms: "PMS",
    insurance: "Insurance",
    pension_fund: "Pension",
    dfi: "DFI",
    nbfc: "NBFC",
    fund_of_funds: "FoF",
  };
  return (
    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
      {labels[type] || type}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-[var(--success)]"
      : score >= 40
        ? "text-[var(--warning)]"
        : "text-[var(--muted)]";
  return <span className={`font-mono font-medium ${color}`}>{score}</span>;
}
