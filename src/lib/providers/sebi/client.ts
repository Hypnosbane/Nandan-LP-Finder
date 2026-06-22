import type {
  ContactProvider,
  OrganizationSearchResult,
  ContactSearchResult,
  ContactEnrichmentResult,
} from "../types";

interface InstitutionalRecord {
  name: string;
  type: "aif" | "pms" | "insurance" | "pension" | "bank" | "nbfc" | "dfi";
  subType: string;
  registrationNumber: string | null;
  regulator: string;
  city: string;
  state: string;
  estimatedAum: string | null;
  alternativesExposure: string | null;
  keyPerson: string | null;
  keyPersonTitle: string | null;
  website: string | null;
}

const INSTITUTIONAL_DATA: InstitutionalRecord[] = [
  // --- SEBI-registered AIFs (Category II - PE/Credit) ---
  { name: "Edelweiss Alternative Asset Advisors", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/13-14/0032", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹25,000 Cr", alternativesExposure: "100%", keyPerson: "Venkat Ramaswamy", keyPersonTitle: "Head - Alternatives", website: "edelweissfin.com" },
  { name: "Kotak Special Situations Fund", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/16-17/0234", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹10,000 Cr", alternativesExposure: "100%", keyPerson: "Srini Sriniwasan", keyPersonTitle: "Managing Director", website: "kotakamc.com" },
  { name: "IIFL Special Opportunities Fund", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/15-16/0178", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹5,000 Cr", alternativesExposure: "100%", keyPerson: null, keyPersonTitle: null, website: "iiflcap.com" },
  { name: "True North Fund VI", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/18-19/0432", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹8,000 Cr", alternativesExposure: "100%", keyPerson: "Vishal Nevatia", keyPersonTitle: "Managing Partner", website: "truenorth.co.in" },
  { name: "ChrysCapital Fund IX", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/20-21/0812", regulator: "SEBI", city: "New Delhi", state: "Delhi", estimatedAum: "₹15,000 Cr", alternativesExposure: "100%", keyPerson: "Ashish Dhawan", keyPersonTitle: "Co-Founder", website: "chryscapital.com" },
  { name: "Kedaara Capital Fund III", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/21-22/0890", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹12,000 Cr", alternativesExposure: "100%", keyPerson: "Manish Kejriwal", keyPersonTitle: "Managing Partner", website: "kedaara.com" },
  { name: "Multiples Private Equity Fund III", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/19-20/0567", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹7,500 Cr", alternativesExposure: "100%", keyPerson: "Renuka Ramnath", keyPersonTitle: "Founder & CEO", website: "multiples.pe" },
  { name: "India Alternatives Fund III", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/20-21/0789", regulator: "SEBI", city: "Bengaluru", state: "Karnataka", estimatedAum: "₹2,500 Cr", alternativesExposure: "100%", keyPerson: "Anil Ahuja", keyPersonTitle: "Managing Director", website: "indiaalternatives.com" },
  { name: "Avendus Future Leaders Fund", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/15-16/0156", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹4,000 Cr", alternativesExposure: "100%", keyPerson: "Ritesh Chandra", keyPersonTitle: "Managing Partner", website: "avendus.com" },
  { name: "Motilal Oswal Private Equity Fund", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/13-14/0045", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹3,500 Cr", alternativesExposure: "100%", keyPerson: "Vishal Tulsyan", keyPersonTitle: "CEO - PE", website: "motilaloswalpe.com" },
  { name: "Nippon India AIF", type: "aif", subType: "PE Fund", registrationNumber: "IN/AIF2/17-18/0312", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹3,000 Cr", alternativesExposure: "100%", keyPerson: null, keyPersonTitle: null, website: "nipponindiamf.com" },
  { name: "ASK India Select Fund", type: "aif", subType: "Long Only AIF", registrationNumber: "IN/AIF3/16-17/0256", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹2,000 Cr", alternativesExposure: "100%", keyPerson: "Bharat Shah", keyPersonTitle: "Executive Director", website: "askfinancials.com" },
  { name: "Blume Ventures Fund IV", type: "aif", subType: "VC Fund", registrationNumber: "IN/AIF3/21-22/0987", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹1,500 Cr", alternativesExposure: "100%", keyPerson: "Karthik Reddy", keyPersonTitle: "Co-Founder", website: "blume.vc" },
  { name: "Vivriti Asset Management", type: "aif", subType: "Credit Fund", registrationNumber: "IN/AIF2/19-20/0612", regulator: "SEBI", city: "Chennai", state: "Tamil Nadu", estimatedAum: "₹5,000 Cr", alternativesExposure: "100%", keyPerson: "Gaurav Kumar", keyPersonTitle: "CEO", website: "vivriti.com" },
  { name: "Northern Arc Capital", type: "aif", subType: "Credit Fund", registrationNumber: "IN/AIF2/17-18/0345", regulator: "SEBI", city: "Chennai", state: "Tamil Nadu", estimatedAum: "₹10,000 Cr", alternativesExposure: "100%", keyPerson: "Ashish Mehrotra", keyPersonTitle: "MD & CEO", website: "northernarc.com" },
  { name: "InCred Capital", type: "aif", subType: "Credit Fund", registrationNumber: "IN/AIF2/18-19/0456", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹3,000 Cr", alternativesExposure: "100%", keyPerson: "Bhupinder Singh", keyPersonTitle: "Founder", website: "incred.com" },

  // --- SEBI-registered PMS providers ---
  { name: "Marcellus Investment Managers", type: "pms", subType: "PMS", registrationNumber: "INP000005862", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹8,000 Cr", alternativesExposure: "30%", keyPerson: "Saurabh Mukherjea", keyPersonTitle: "Founder & CIO", website: "marcellus.in" },
  { name: "Buoyant Capital", type: "pms", subType: "PMS", registrationNumber: "INP000007156", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹1,500 Cr", alternativesExposure: "20%", keyPerson: null, keyPersonTitle: null, website: null },
  { name: "Unifi Capital", type: "pms", subType: "PMS", registrationNumber: "INP000001165", regulator: "SEBI", city: "Chennai", state: "Tamil Nadu", estimatedAum: "₹3,000 Cr", alternativesExposure: "25%", keyPerson: "Sarath Reddy", keyPersonTitle: "Founder", website: "unificap.com" },
  { name: "Carnelian Asset Management", type: "pms", subType: "PMS", registrationNumber: "INP000006488", regulator: "SEBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹2,500 Cr", alternativesExposure: "15%", keyPerson: "Vikas Khemani", keyPersonTitle: "Founder", website: "carnelianasset.com" },

  // --- Insurance companies (IRDAI regulated) ---
  { name: "Life Insurance Corporation of India", type: "insurance", subType: "Life Insurance", registrationNumber: "512", regulator: "IRDAI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹43,00,000 Cr", alternativesExposure: "5%", keyPerson: "Siddhartha Mohanty", keyPersonTitle: "Chairperson", website: "licindia.in" },
  { name: "HDFC Life Insurance", type: "insurance", subType: "Life Insurance", registrationNumber: "101", regulator: "IRDAI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹2,50,000 Cr", alternativesExposure: "8%", keyPerson: "Vibha Padalkar", keyPersonTitle: "MD & CEO", website: "hdfclife.com" },
  { name: "ICICI Prudential Life Insurance", type: "insurance", subType: "Life Insurance", registrationNumber: "105", regulator: "IRDAI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹2,80,000 Cr", alternativesExposure: "7%", keyPerson: "Anup Bagchi", keyPersonTitle: "MD & CEO", website: "iciciprulife.com" },
  { name: "SBI Life Insurance", type: "insurance", subType: "Life Insurance", registrationNumber: "111", regulator: "IRDAI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹3,50,000 Cr", alternativesExposure: "6%", keyPerson: "Amit Jhingran", keyPersonTitle: "MD & CEO", website: "sbilife.co.in" },
  { name: "Bajaj Allianz Life Insurance", type: "insurance", subType: "Life Insurance", registrationNumber: "116", regulator: "IRDAI", city: "Pune", state: "Maharashtra", estimatedAum: "₹1,00,000 Cr", alternativesExposure: "5%", keyPerson: "Tarun Chugh", keyPersonTitle: "MD & CEO", website: "bajajallianzlife.com" },
  { name: "Max Life Insurance", type: "insurance", subType: "Life Insurance", registrationNumber: "104", regulator: "IRDAI", city: "New Delhi", state: "Delhi", estimatedAum: "₹1,30,000 Cr", alternativesExposure: "6%", keyPerson: "Prashant Tripathy", keyPersonTitle: "MD & CEO", website: "maxlifeinsurance.com" },
  { name: "New India Assurance", type: "insurance", subType: "General Insurance", registrationNumber: "190", regulator: "IRDAI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹45,000 Cr", alternativesExposure: "3%", keyPerson: null, keyPersonTitle: null, website: "newindia.co.in" },

  // --- Pension funds ---
  { name: "Employees' Provident Fund Organisation (EPFO)", type: "pension", subType: "Provident Fund", registrationNumber: null, regulator: "Ministry of Labour", city: "New Delhi", state: "Delhi", estimatedAum: "₹18,00,000 Cr", alternativesExposure: "2%", keyPerson: null, keyPersonTitle: null, website: "epfindia.gov.in" },
  { name: "National Pension System Trust (NPS)", type: "pension", subType: "Pension Fund", registrationNumber: null, regulator: "PFRDA", city: "New Delhi", state: "Delhi", estimatedAum: "₹12,00,000 Cr", alternativesExposure: "3%", keyPerson: null, keyPersonTitle: null, website: "npstrust.org.in" },
  { name: "Coal Mines Provident Fund", type: "pension", subType: "Provident Fund", registrationNumber: null, regulator: "Ministry of Coal", city: "Dhanbad", state: "Jharkhand", estimatedAum: "₹65,000 Cr", alternativesExposure: "1%", keyPerson: null, keyPersonTitle: null, website: null },

  // --- Development Finance Institutions ---
  { name: "National Investment and Infrastructure Fund (NIIF)", type: "dfi", subType: "Sovereign Fund", registrationNumber: null, regulator: "Government of India", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹50,000 Cr", alternativesExposure: "80%", keyPerson: "Sujoy Bose", keyPersonTitle: "MD & CEO", website: "niifindia.in" },
  { name: "SIDBI Venture Capital", type: "dfi", subType: "DFI", registrationNumber: null, regulator: "SIDBI", city: "Lucknow", state: "Uttar Pradesh", estimatedAum: "₹10,000 Cr", alternativesExposure: "100%", keyPerson: null, keyPersonTitle: null, website: "sidbiventure.co.in" },
  { name: "India Infrastructure Finance Company (IIFCL)", type: "dfi", subType: "DFI", registrationNumber: null, regulator: "Government of India", city: "New Delhi", state: "Delhi", estimatedAum: "₹35,000 Cr", alternativesExposure: "20%", keyPerson: null, keyPersonTitle: null, website: "iifcl.org" },

  // --- NBFCs with alternatives allocation ---
  { name: "Bajaj Finance", type: "nbfc", subType: "NBFC", registrationNumber: "N-07.00316", regulator: "RBI", city: "Pune", state: "Maharashtra", estimatedAum: "₹3,10,000 Cr", alternativesExposure: "5%", keyPerson: "Rajeev Jain", keyPersonTitle: "MD", website: "bajajfinserv.in" },
  { name: "Piramal Enterprises (Financial Services)", type: "nbfc", subType: "NBFC", registrationNumber: "N-13.02238", regulator: "RBI", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹70,000 Cr", alternativesExposure: "15%", keyPerson: "Jairam Sridharan", keyPersonTitle: "MD", website: "piramal.com" },
];

export class SebiAifProvider implements ContactProvider {
  readonly name = "sebi_aif";

  async searchOrganizations(
    query: string,
    filters?: Record<string, unknown>
  ): Promise<OrganizationSearchResult[]> {
    const type = filters?.type as string | undefined;
    const state = filters?.state as string | undefined;

    const q = query.toLowerCase();
    const matches = INSTITUTIONAL_DATA.filter((record) => {
      const textMatch =
        record.name.toLowerCase().includes(q) ||
        record.subType.toLowerCase().includes(q) ||
        record.type.toLowerCase().includes(q) ||
        (record.keyPerson?.toLowerCase().includes(q) ?? false);
      const typeMatch = type
        ? record.type === type || record.subType.toLowerCase().includes(type.toLowerCase())
        : true;
      const stateMatch = state
        ? record.state.toLowerCase().includes(state.toLowerCase())
        : true;
      return textMatch && typeMatch && stateMatch;
    });

    if (matches.length === 0 && q.length > 0) {
      return INSTITUTIONAL_DATA.filter(
        (r) =>
          r.subType.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.regulator.toLowerCase().includes(q)
      ).map(toOrgResult);
    }

    return matches.map(toOrgResult);
  }

  async searchContacts(
    organizationName: string,
    _titles?: string[]
  ): Promise<ContactSearchResult[]> {
    const org = INSTITUTIONAL_DATA.find(
      (r) => r.name.toLowerCase().includes(organizationName.toLowerCase())
    );
    if (!org) return [];

    const contacts: ContactSearchResult[] = [];

    if (org.keyPerson) {
      contacts.push({
        name: org.keyPerson,
        title: org.keyPersonTitle,
        email: null,
        emailConfidence: 0,
        linkedinUrl: null,
        organizationName: org.name,
        rawData: {
          registrationNumber: org.registrationNumber,
          note: "Contact details require enrichment via Apollo/Hunter",
        },
      });
    } else {
      contacts.push({
        name: `Senior Investment Professional at ${org.name}`,
        title: "Investment Team",
        email: null,
        emailConfidence: 0,
        linkedinUrl: null,
        organizationName: org.name,
        rawData: { note: "Key person not in database — use Apollo/LinkedIn for discovery" },
      });
    }

    return contacts;
  }

  async enrichContact(): Promise<ContactEnrichmentResult | null> {
    return null;
  }
}

function toOrgResult(record: InstitutionalRecord): OrganizationSearchResult {
  const regulatorLabel = record.registrationNumber
    ? `${record.regulator} Reg: ${record.registrationNumber}`
    : `Regulated by ${record.regulator}`;

  return {
    name: record.name,
    domain: record.website,
    industry: `${record.type.toUpperCase()} - ${record.subType}`,
    employeeCount: null,
    location: `${record.city}, ${record.state}, India`,
    description: `${record.subType}. ${regulatorLabel}. Est. AUM: ${record.estimatedAum || "N/A"}. Alternatives exposure: ${record.alternativesExposure || "N/A"}`,
    rawData: {
      type: record.type,
      subType: record.subType,
      registrationNumber: record.registrationNumber,
      regulator: record.regulator,
      estimatedAum: record.estimatedAum,
      alternativesExposure: record.alternativesExposure,
      keyPerson: record.keyPerson,
      keyPersonTitle: record.keyPersonTitle,
      source: `${record.regulator} Registry / Public Data`,
    },
  };
}
