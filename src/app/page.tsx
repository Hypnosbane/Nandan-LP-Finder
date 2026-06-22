"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  organizations: number;
  contacts: number;
  campaigns: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ organizations: 0, contacts: 0, campaigns: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [orgsRes, contactsRes] = await Promise.all([
          fetch("/api/organizations"),
          fetch("/api/contacts"),
        ]);
        const orgs = await orgsRes.json();
        const contacts = await contactsRes.json();
        setStats({
          organizations: Array.isArray(orgs) ? orgs.length : 0,
          contacts: Array.isArray(contacts) ? contacts.length : 0,
          campaigns: 0,
        });
      } catch {
        // DB may not be connected
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--muted)] mt-1">
          Discover, research, and reach out to potential Limited Partners.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Organizations" value={loading ? "..." : stats.organizations} />
        <StatCard label="Contacts" value={loading ? "..." : stats.contacts} />
        <StatCard label="Campaigns" value={loading ? "..." : stats.campaigns} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActionCard
          href="/search"
          title="Search LPs"
          description="Search across SEBI AIFs, family offices, insurance companies, and more."
        />
        <ActionCard
          href="/organizations"
          title="View Pipeline"
          description="See all saved organizations and their qualification scores."
        />
        <ActionCard
          href="/outreach"
          title="Generate Outreach"
          description="Create personalized emails for your top prospects."
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--primary)] transition-colors group"
    >
      <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[var(--muted)] mt-1">{description}</p>
    </Link>
  );
}
