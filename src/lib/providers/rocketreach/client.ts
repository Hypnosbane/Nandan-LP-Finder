import type {
  ContactProvider,
  OrganizationSearchResult,
  ContactSearchResult,
  ContactEnrichmentResult,
} from "../types";

export class RocketReachProvider implements ContactProvider {
  readonly name = "rocketreach";
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.rocketreach.co/v2/api";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchOrganizations(
    query: string
  ): Promise<OrganizationSearchResult[]> {
    const response = await fetch(`${this.baseUrl}/search/company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": this.apiKey,
      },
      body: JSON.stringify({
        query: { name: [query] },
      }),
    });

    if (!response.ok) {
      throw new Error(`RocketReach search failed: ${response.status}`);
    }

    const data = await response.json();
    const companies = data.companies || [];

    return companies.map(
      (company: Record<string, unknown>): OrganizationSearchResult => ({
        name: (company.name as string) || "",
        domain: (company.domain as string) || null,
        industry: (company.industry as string) || null,
        employeeCount: (company.employee_count as number) || null,
        location: (company.location as string) || null,
        description: (company.description as string) || null,
        rawData: company,
      })
    );
  }

  async searchContacts(
    organizationName: string,
    titles?: string[]
  ): Promise<ContactSearchResult[]> {
    const response = await fetch(`${this.baseUrl}/search/person`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": this.apiKey,
      },
      body: JSON.stringify({
        query: {
          current_employer: [organizationName],
          current_title: titles,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`RocketReach contact search failed: ${response.status}`);
    }

    const data = await response.json();
    const profiles = data.profiles || [];

    return profiles.map(
      (profile: Record<string, unknown>): ContactSearchResult => ({
        name: (profile.name as string) || "",
        title: (profile.current_title as string) || null,
        email: (profile.email as string) || null,
        emailConfidence: profile.email ? 90 : 0,
        linkedinUrl: (profile.linkedin_url as string) || null,
        organizationName:
          (profile.current_employer as string) || organizationName,
        rawData: profile,
      })
    );
  }

  async enrichContact(
    name: string,
    organizationName: string
  ): Promise<ContactEnrichmentResult | null> {
    const response = await fetch(`${this.baseUrl}/lookupProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": this.apiKey,
      },
      body: JSON.stringify({
        name,
        current_employer: organizationName,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.error) return null;

    return {
      email: data.email || null,
      emailConfidence: data.email ? 90 : 0,
      phone: data.phone || null,
      linkedinUrl: data.linkedin_url || null,
      title: data.current_title || null,
      rawData: data,
    };
  }
}
