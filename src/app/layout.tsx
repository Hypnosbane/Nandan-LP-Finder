import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nandan LP Finder",
  description: "AI-assisted LP discovery and outreach platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="border-b border-[var(--border)] bg-[var(--card)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-lg font-bold text-[var(--primary)]">
                  Nandan LP Finder
                </Link>
                <div className="hidden sm:flex items-center gap-1">
                  <NavLink href="/">Dashboard</NavLink>
                  <NavLink href="/search">Search</NavLink>
                  <NavLink href="/organizations">Organizations</NavLink>
                  <NavLink href="/outreach">Outreach</NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-[var(--muted)] rounded-md hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
    >
      {children}
    </Link>
  );
}
