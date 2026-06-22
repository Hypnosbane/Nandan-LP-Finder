import type {
  ContactProvider,
  OrganizationSearchResult,
  ContactSearchResult,
  ContactEnrichmentResult,
} from "../types";

const MOCK_ORGANIZATIONS: OrganizationSearchResult[] = [
  {
    name: "Evergreen Capital Family Office",
    domain: "evergreencapital.example.com",
    industry: "Financial Services",
    employeeCount: 25,
    location: "New York, NY, US",
    description: "Multi-family office focused on alternative investments",
    rawData: {},
  },
  {
    name: "Pacific Endowment Fund",
    domain: "pacificendowment.example.com",
    industry: "Education",
    employeeCount: 15,
    location: "San Francisco, CA, US",
    description: "University endowment with $2B AUM",
    rawData: {},
  },
  {
    name: "Heartland Pension System",
    domain: "heartlandpension.example.com",
    industry: "Government",
    employeeCount: 50,
    location: "Chicago, IL, US",
    description: "State pension fund with growing alternatives allocation",
    rawData: {},
  },
];

const MOCK_CONTACTS: ContactSearchResult[] = [
  {
    name: "Sarah Chen",
    title: "Chief Investment Officer",
    email: "s.chen@evergreencapital.example.com",
    emailConfidence: 95,
    linkedinUrl: "https://linkedin.com/in/example-sarah-chen",
    organizationName: "Evergreen Capital Family Office",
    rawData: {},
  },
  {
    name: "Michael Torres",
    title: "Director of Private Credit",
    email: "m.torres@pacificendowment.example.com",
    emailConfidence: 90,
    linkedinUrl: "https://linkedin.com/in/example-michael-torres",
    organizationName: "Pacific Endowment Fund",
    rawData: {},
  },
  {
    name: "Jennifer Park",
    title: "Portfolio Manager, Alternatives",
    email: "j.park@heartlandpension.example.com",
    emailConfidence: 85,
    linkedinUrl: null,
    organizationName: "Heartland Pension System",
    rawData: {},
  },
];

export class MockProvider implements ContactProvider {
  readonly name = "mock";

  async searchOrganizations(
    query: string
  ): Promise<OrganizationSearchResult[]> {
    await delay(200);
    return MOCK_ORGANIZATIONS.filter((org) =>
      org.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async searchContacts(
    organizationName: string,
    titles?: string[]
  ): Promise<ContactSearchResult[]> {
    await delay(150);
    return MOCK_CONTACTS.filter((c) => {
      const orgMatch =
        c.organizationName?.toLowerCase() === organizationName.toLowerCase();
      if (!titles?.length) return orgMatch;
      return (
        orgMatch &&
        titles.some((t) =>
          c.title?.toLowerCase().includes(t.toLowerCase())
        )
      );
    });
  }

  async enrichContact(
    name: string
  ): Promise<ContactEnrichmentResult | null> {
    await delay(100);
    const contact = MOCK_CONTACTS.find((c) =>
      c.name.toLowerCase().includes(name.toLowerCase())
    );
    if (!contact) return null;
    return {
      email: contact.email,
      emailConfidence: contact.emailConfidence,
      phone: null,
      linkedinUrl: contact.linkedinUrl,
      title: contact.title,
      rawData: {},
    };
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
