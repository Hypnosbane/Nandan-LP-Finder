export interface OrganizationSearchResult {
  name: string;
  domain: string | null;
  industry: string | null;
  employeeCount: number | null;
  location: string | null;
  description: string | null;
  rawData: Record<string, unknown>;
}

export interface ContactSearchResult {
  name: string;
  title: string | null;
  email: string | null;
  emailConfidence: number;
  linkedinUrl: string | null;
  organizationName: string | null;
  rawData: Record<string, unknown>;
}

export interface ContactEnrichmentResult {
  email: string | null;
  emailConfidence: number;
  phone: string | null;
  linkedinUrl: string | null;
  title: string | null;
  rawData: Record<string, unknown>;
}

export interface ContactProvider {
  readonly name: string;

  searchOrganizations(query: string, filters?: Record<string, unknown>): Promise<OrganizationSearchResult[]>;
  searchContacts(organizationName: string, titles?: string[]): Promise<ContactSearchResult[]>;
  enrichContact(name: string, organizationName: string): Promise<ContactEnrichmentResult | null>;
}
