import type {
  ContactProvider,
  OrganizationSearchResult,
  ContactSearchResult,
  ContactEnrichmentResult,
} from "../types";

export class ApolloProvider implements ContactProvider {
  readonly name = "apollo";
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.apollo.io/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchOrganizations(
    query: string,
    filters?: Record<string, unknown>
  ): Promise<OrganizationSearchResult[]> {
    const response = await fetch(`${this.baseUrl}/mixed_companies/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": this.apiKey,
      },
      body: JSON.stringify({
        q_organization_name: query,
        ...filters,
      }),
    });

    if (!response.ok) {
      throw new Error(`Apollo search failed: ${response.status}`);
    }

    const data = await response.json();
    const accounts = data.accounts || [];

    return accounts.map(
      (account: Record<string, unknown>): OrganizationSearchResult => ({
        name: (account.name as string) || "",
        domain: (account.domain as string) || null,
        industry: (account.industry as string) || null,
        employeeCount: (account.employee_count as number) || null,
        location:
          [account.city, account.state, account.country]
            .filter(Boolean)
            .join(", ") || null,
        description: (account.short_description as string) || null,
        rawData: account,
      })
    );
  }

  async searchContacts(
    organizationName: string,
    titles?: string[]
  ): Promise<ContactSearchResult[]> {
    const response = await fetch(`${this.baseUrl}/mixed_people/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": this.apiKey,
      },
      body: JSON.stringify({
        q_organization_name: organizationName,
        person_titles: titles,
      }),
    });

    if (!response.ok) {
      throw new Error(`Apollo contact search failed: ${response.status}`);
    }

    const data = await response.json();
    const people = data.people || [];

    return people.map(
      (person: Record<string, unknown>): ContactSearchResult => ({
        name: (person.name as string) || "",
        title: (person.title as string) || null,
        email: (person.email as string) || null,
        emailConfidence: person.email_status === "verified" ? 95 : 50,
        linkedinUrl: (person.linkedin_url as string) || null,
        organizationName:
          (person.organization_name as string) || organizationName,
        rawData: person,
      })
    );
  }

  async enrichContact(
    name: string,
    organizationName: string
  ): Promise<ContactEnrichmentResult | null> {
    const response = await fetch(`${this.baseUrl}/people/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": this.apiKey,
      },
      body: JSON.stringify({
        name,
        organization_name: organizationName,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const person = data.person;
    if (!person) return null;

    return {
      email: person.email || null,
      emailConfidence: person.email_status === "verified" ? 95 : 50,
      phone: person.phone_number || null,
      linkedinUrl: person.linkedin_url || null,
      title: person.title || null,
      rawData: person,
    };
  }
}
