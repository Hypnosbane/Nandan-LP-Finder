"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface GeneratedEmail {
  subject: string;
  body: string;
  variant: string;
}

const TYPE_MAP: Record<string, string> = {
  family_office: "family_office",
  aif: "aif",
  insurance: "insurance",
  pension_fund: "pension_fund",
  fund_of_funds: "fund_of_funds",
  dfi: "dfi",
  pms: "pms",
  nbfc: "nbfc",
};

export default function OutreachPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-[var(--muted)]">Loading...</div>}>
      <OutreachContent />
    </Suspense>
  );
}

function OutreachContent() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    organizationName: "",
    contactName: "",
    contactRole: "",
    investorType: "family_office",
    fundStrategy: "",
    fundOverview: "",
    personalizationNotes: "",
    variant: "standard" as "short" | "standard" | "executive",
  });

  useEffect(() => {
    const org = searchParams.get("org");
    const type = searchParams.get("type");
    if (org || type) {
      setForm((prev) => ({
        ...prev,
        ...(org ? { organizationName: org } : {}),
        ...(type && TYPE_MAP[type] ? { investorType: TYPE_MAP[type] } : {}),
      }));
    }
  }, [searchParams]);
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmail(null);
    try {
      const res = await fetch("/api/agents/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate email");
        return;
      }
      setEmail(data);
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (!email) return;
    navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Generate Outreach</h1>
        <p className="text-[var(--muted)] mt-1">
          Create personalized outreach emails for your LP prospects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 space-y-4">
            <h2 className="font-semibold">Prospect Details</h2>

            <Field label="Organization Name" required>
              <input
                type="text"
                value={form.organizationName}
                onChange={(e) => update("organizationName", e.target.value)}
                placeholder="e.g., Premji Invest"
                className="input"
                required
              />
            </Field>

            <Field label="Contact Name" required>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
                placeholder="e.g., Prakash Parthasarathy"
                className="input"
                required
              />
            </Field>

            <Field label="Contact Role">
              <input
                type="text"
                value={form.contactRole}
                onChange={(e) => update("contactRole", e.target.value)}
                placeholder="e.g., CEO, CIO, Managing Partner"
                className="input"
              />
            </Field>

            <Field label="Investor Type">
              <select
                value={form.investorType}
                onChange={(e) => update("investorType", e.target.value)}
                className="input"
              >
                <option value="family_office">Family Office</option>
                <option value="aif">AIF / Fund Manager</option>
                <option value="insurance">Insurance Company</option>
                <option value="pension_fund">Pension Fund</option>
                <option value="fund_of_funds">Fund of Funds</option>
                <option value="dfi">DFI / Sovereign Fund</option>
                <option value="pms">PMS Provider</option>
                <option value="nbfc">NBFC</option>
              </select>
            </Field>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 space-y-4">
            <h2 className="font-semibold">Your Fund</h2>

            <Field label="Fund Strategy" required>
              <input
                type="text"
                value={form.fundStrategy}
                onChange={(e) => update("fundStrategy", e.target.value)}
                placeholder="e.g., Private Credit, Direct Lending"
                className="input"
                required
              />
            </Field>

            <Field label="Fund Overview">
              <textarea
                value={form.fundOverview}
                onChange={(e) => update("fundOverview", e.target.value)}
                placeholder="Brief description of your fund, team, track record..."
                className="input min-h-[80px] resize-y"
                rows={3}
              />
            </Field>

            <Field label="Personalization Notes">
              <textarea
                value={form.personalizationNotes}
                onChange={(e) => update("personalizationNotes", e.target.value)}
                placeholder="Any specific context about this prospect..."
                className="input min-h-[60px] resize-y"
                rows={2}
              />
            </Field>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
            <Field label="Email Length">
              <div className="flex gap-2">
                {(["short", "standard", "executive"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update("variant", v)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                      form.variant === v
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                    <span className="block text-xs opacity-70">
                      {v === "short" ? "75-120 words" : v === "standard" ? "150-250 words" : "300-400 words"}
                    </span>
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
          >
            {loading ? "Generating with Claude..." : "Generate Email"}
          </button>
        </form>

        <div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              {error.includes("credit balance") && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Add credits at console.anthropic.com to enable AI features.
                </p>
              )}
            </div>
          )}

          {email ? (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2 className="font-semibold">Generated Email</h2>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 text-sm rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-[var(--muted)] mb-1">Subject</p>
                  <p className="font-medium">{email.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] mb-1">Body</p>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {email.body}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-8 text-center">
              <p className="text-[var(--muted)]">
                Fill in the prospect details and click Generate to create a personalized outreach email.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          ring: 2px;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 25%, transparent);
        }
        .input::placeholder {
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-[var(--danger)] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
