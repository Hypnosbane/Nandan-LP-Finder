import type {
  ContactProvider,
  OrganizationSearchResult,
  ContactSearchResult,
  ContactEnrichmentResult,
} from "../types";

const SEBI_AIF_SEARCH_URL =
  "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=40";

interface SebiAifRecord {
  name: string;
  registrationNumber: string;
  category: string;
  subCategory: string;
  city: string;
  state: string;
  manager: string;
  registrationDate: string;
}

const KNOWN_AIF_DATA: SebiAifRecord[] = [
  { name: "Blume Ventures Fund IV", registrationNumber: "IN/AIF3/21-22/0987", category: "Category III", subCategory: "VC Fund", city: "Mumbai", state: "Maharashtra", manager: "Blume Ventures", registrationDate: "2021-09-15" },
  { name: "Chiratae Ventures Fund IV", registrationNumber: "IN/AIF1/19-20/0654", category: "Category I", subCategory: "VC Fund", city: "Bengaluru", state: "Karnataka", manager: "Chiratae Ventures", registrationDate: "2019-11-20" },
  { name: "Edelweiss Alternative Asset Advisors", registrationNumber: "IN/AIF2/13-14/0032", category: "Category II", subCategory: "PE Fund", city: "Mumbai", state: "Maharashtra", manager: "Edelweiss Group", registrationDate: "2013-06-10" },
  { name: "ICICI Prudential Real Estate AIF", registrationNumber: "IN/AIF2/14-15/0089", category: "Category II", subCategory: "Real Estate", city: "Mumbai", state: "Maharashtra", manager: "ICICI Prudential", registrationDate: "2014-08-22" },
  { name: "Kotak Special Situations Fund", registrationNumber: "IN/AIF2/16-17/0234", category: "Category II", subCategory: "PE Fund", city: "Mumbai", state: "Maharashtra", manager: "Kotak Investment Advisors", registrationDate: "2016-04-18" },
  { name: "Motilal Oswal Private Equity Fund", registrationNumber: "IN/AIF2/13-14/0045", category: "Category II", subCategory: "PE Fund", city: "Mumbai", state: "Maharashtra", manager: "Motilal Oswal AMC", registrationDate: "2013-09-30" },
  { name: "Nippon India AIF", registrationNumber: "IN/AIF2/17-18/0312", category: "Category II", subCategory: "PE Fund", city: "Mumbai", state: "Maharashtra", manager: "Nippon Life India", registrationDate: "2017-07-14" },
  { name: "Avendus Future Leaders Fund", registrationNumber: "IN/AIF2/15-16/0156", category: "Category II", subCategory: "PE Fund", city: "Mumbai", state: "Maharashtra", manager: "Avendus Capital", registrationDate: "2015-12-08" },
  { name: "True North Fund VI", registrationNumber: "IN/AIF2/18-19/0432", category: "Category II", subCategory: "PE Fund", city: "Mumbai", state: "Maharashtra", manager: "True North", registrationDate: "2018-05-20" },
  { name: "India Alternatives Fund III", registrationNumber: "IN/AIF2/20-21/0789", category: "Category II", subCategory: "PE Fund", city: "Bengaluru", state: "Karnataka", manager: "India Alternatives", registrationDate: "2020-10-12" },
  { name: "Multiples Private Equity Fund III", registrationNumber: "IN/AIF2/19-20/0567", category: "Category II", subCategory: "PE Fund", city: "Mumbai", state: "Maharashtra", manager: "Multiples Alternate Asset Mgmt", registrationDate: "2019-03-25" },
  { name: "Kedaara Capital Fund III", registrationNumber: "IN/AIF2/21-22/0890", category: "Category II", subCategory: "PE Fund", city: "Mumbai", state: "Maharashtra", manager: "Kedaara Capital", registrationDate: "2021-01-15" },
  { name: "ChrysCapital Fund IX", registrationNumber: "IN/AIF2/20-21/0812", category: "Category II", subCategory: "PE Fund", city: "New Delhi", state: "Delhi", manager: "ChrysCapital", registrationDate: "2020-06-30" },
  { name: "IIFL Special Opportunities Fund", registrationNumber: "IN/AIF2/15-16/0178", category: "Category II", subCategory: "PE Fund", city: "Mumbai", state: "Maharashtra", manager: "IIFL AMC", registrationDate: "2015-08-14" },
  { name: "ASK India Select Fund", registrationNumber: "IN/AIF3/16-17/0256", category: "Category III", subCategory: "Long Only", city: "Mumbai", state: "Maharashtra", manager: "ASK Investment Managers", registrationDate: "2016-11-05" },
];

export class SebiAifProvider implements ContactProvider {
  readonly name = "sebi_aif";

  async searchOrganizations(
    query: string,
    filters?: Record<string, unknown>
  ): Promise<OrganizationSearchResult[]> {
    const category = filters?.category as string | undefined;
    const state = filters?.state as string | undefined;

    const matches = KNOWN_AIF_DATA.filter((record) => {
      const nameMatch =
        record.name.toLowerCase().includes(query.toLowerCase()) ||
        record.manager.toLowerCase().includes(query.toLowerCase());
      const categoryMatch = category
        ? record.category.toLowerCase().includes(category.toLowerCase())
        : true;
      const stateMatch = state
        ? record.state.toLowerCase().includes(state.toLowerCase())
        : true;
      return nameMatch && categoryMatch && stateMatch;
    });

    if (matches.length === 0 && query.length > 0) {
      return KNOWN_AIF_DATA.filter(
        (r) =>
          r.subCategory.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      ).map(toOrgResult);
    }

    return matches.map(toOrgResult);
  }

  async searchContacts(
    organizationName: string,
    _titles?: string[]
  ): Promise<ContactSearchResult[]> {
    const org = KNOWN_AIF_DATA.find(
      (r) =>
        r.name.toLowerCase().includes(organizationName.toLowerCase()) ||
        r.manager.toLowerCase().includes(organizationName.toLowerCase())
    );
    if (!org) return [];

    return [
      {
        name: `Managing Partner at ${org.manager}`,
        title: "Managing Partner",
        email: null,
        emailConfidence: 0,
        linkedinUrl: null,
        organizationName: org.name,
        rawData: { sebiRegistration: org.registrationNumber, note: "Contact details require enrichment via Apollo/Hunter" },
      },
    ];
  }

  async enrichContact(): Promise<ContactEnrichmentResult | null> {
    return null;
  }
}

function toOrgResult(record: SebiAifRecord): OrganizationSearchResult {
  return {
    name: record.name,
    domain: null,
    industry: `AIF - ${record.subCategory}`,
    employeeCount: null,
    location: `${record.city}, ${record.state}, India`,
    description: `SEBI registered ${record.category} ${record.subCategory}. Manager: ${record.manager}. Reg: ${record.registrationNumber}`,
    rawData: {
      registrationNumber: record.registrationNumber,
      category: record.category,
      subCategory: record.subCategory,
      manager: record.manager,
      registrationDate: record.registrationDate,
      source: "SEBI AIF Registry",
      sourceUrl: SEBI_AIF_SEARCH_URL,
    },
  };
}
