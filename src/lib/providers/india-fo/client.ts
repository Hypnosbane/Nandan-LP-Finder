import type {
  ContactProvider,
  OrganizationSearchResult,
  ContactSearchResult,
  ContactEnrichmentResult,
} from "../types";

interface FamilyOfficeRecord {
  name: string;
  promoterFamily: string;
  sourceOfWealth: string;
  city: string;
  state: string;
  estimatedAum: string;
  investsInAlternatives: boolean;
  knownAlternativeFocus: string[];
  keyPerson: string | null;
  keyPersonTitle: string | null;
  website: string | null;
  publiclyKnown: boolean;
}

const INDIAN_FAMILY_OFFICES: FamilyOfficeRecord[] = [
  // --- Mega family offices (>$1B AUM) ---
  { name: "Premji Invest", promoterFamily: "Azim Premji (Wipro)", sourceOfWealth: "IT Services", city: "Bengaluru", state: "Karnataka", estimatedAum: "₹50,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["PE", "Venture Capital", "Credit", "Real Estate"], keyPerson: "Prakash Parthasarathy", keyPersonTitle: "CEO", website: "premjiinvest.com", publiclyKnown: true },
  { name: "Catamaran Ventures", promoterFamily: "N.R. Narayana Murthy (Infosys)", sourceOfWealth: "IT Services", city: "Bengaluru", state: "Karnataka", estimatedAum: "₹10,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["VC", "Growth Equity", "Startups"], keyPerson: null, keyPersonTitle: null, website: "catamaranventures.com", publiclyKnown: true },
  { name: "Radhakishan Damani Family Office", promoterFamily: "Radhakishan Damani (DMart)", sourceOfWealth: "Retail", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹40,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["Public Markets", "Real Estate", "PE"], keyPerson: null, keyPersonTitle: null, website: null, publiclyKnown: true },
  { name: "Burman Family Holdings", promoterFamily: "Burman Family (Dabur)", sourceOfWealth: "FMCG", city: "New Delhi", state: "Delhi", estimatedAum: "₹15,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["PE", "VC", "Buyouts"], keyPerson: "Mohit Burman", keyPersonTitle: "Vice Chairman - Dabur", website: null, publiclyKnown: true },
  { name: "Manipal Education Family Office", promoterFamily: "Ranjan Pai (Manipal Group)", sourceOfWealth: "Healthcare & Education", city: "Bengaluru", state: "Karnataka", estimatedAum: "₹8,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["VC", "Healthcare", "Credit"], keyPerson: "Ranjan Pai", keyPersonTitle: "Chairman - Manipal Group", website: null, publiclyKnown: true },
  { name: "Wipro Enterprises Family Office", promoterFamily: "Rishad Premji (Wipro)", sourceOfWealth: "IT Services", city: "Bengaluru", state: "Karnataka", estimatedAum: "₹5,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["VC", "Growth Equity"], keyPerson: null, keyPersonTitle: null, website: null, publiclyKnown: true },

  // --- Large family offices ---
  { name: "MEMG Family Office", promoterFamily: "Munjal Family (Hero Group)", sourceOfWealth: "Automotive", city: "New Delhi", state: "Delhi", estimatedAum: "₹10,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["PE", "VC", "Real Estate"], keyPerson: "Sunil Kant Munjal", keyPersonTitle: "Chairman - Hero Enterprise", website: null, publiclyKnown: true },
  { name: "Enam Holdings", promoterFamily: "Vallabh Bhansali", sourceOfWealth: "Financial Services", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹6,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["PE", "Credit", "Public Equity"], keyPerson: "Vallabh Bhansali", keyPersonTitle: "Co-Founder", website: null, publiclyKnown: true },
  { name: "TVS Capital Funds", promoterFamily: "TVS Family", sourceOfWealth: "Automotive", city: "Chennai", state: "Tamil Nadu", estimatedAum: "₹4,500 Cr", investsInAlternatives: true, knownAlternativeFocus: ["Growth PE", "Mid-market"], keyPerson: "Gopal Srinivasan", keyPersonTitle: "Chairman & MD", website: "tvscapital.in", publiclyKnown: true },
  { name: "A91 Partners", promoterFamily: "Ex-Sequoia team", sourceOfWealth: "Fund Management", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹5,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["Growth Equity", "Consumer", "Technology"], keyPerson: "VT Bharadwaj", keyPersonTitle: "Managing Partner", website: "a91partners.com", publiclyKnown: true },
  { name: "Gaja Capital", promoterFamily: "Gopal Jain", sourceOfWealth: "Fund Management", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹4,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["Mid-market PE", "Consumer", "Financial Services"], keyPerson: "Gopal Jain", keyPersonTitle: "Managing Partner", website: "gajacapital.com", publiclyKnown: true },
  { name: "Azim Premji Foundation Endowment", promoterFamily: "Azim Premji", sourceOfWealth: "IT Services", city: "Bengaluru", state: "Karnataka", estimatedAum: "₹1,50,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["Diversified Alternatives", "Impact"], keyPerson: null, keyPersonTitle: null, website: "azimpremjifoundation.org", publiclyKnown: true },

  // --- Mid-size family offices ---
  { name: "Edelweiss Wealth Family Office", promoterFamily: "Rashesh Shah (Edelweiss)", sourceOfWealth: "Financial Services", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹3,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["Credit", "PE", "Real Estate"], keyPerson: "Rashesh Shah", keyPersonTitle: "Chairman - Edelweiss Group", website: null, publiclyKnown: true },
  { name: "Zerodha Family Office", promoterFamily: "Nithin Kamath (Zerodha)", sourceOfWealth: "Fintech / Broking", city: "Bengaluru", state: "Karnataka", estimatedAum: "₹5,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["VC", "Climate", "Startups"], keyPerson: "Nithin Kamath", keyPersonTitle: "CEO - Zerodha", website: "rainmatter.com", publiclyKnown: true },
  { name: "Devyani Family Office", promoterFamily: "Virag Joshi (Devyani International)", sourceOfWealth: "QSR / Food", city: "Gurugram", state: "Haryana", estimatedAum: "₹2,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["Consumer", "Real Estate"], keyPerson: null, keyPersonTitle: null, website: null, publiclyKnown: false },
  { name: "Sharrp Ventures", promoterFamily: "Raamdeo Agrawal (MOFSL)", sourceOfWealth: "Financial Services", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹3,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["Public Equity", "PE"], keyPerson: "Raamdeo Agrawal", keyPersonTitle: "Co-Founder - MOFSL", website: null, publiclyKnown: true },
  { name: "RK Damani Associates", promoterFamily: "Radhakishan Damani", sourceOfWealth: "Retail / Investments", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹15,000+ Cr", investsInAlternatives: false, knownAlternativeFocus: ["Public Equity"], keyPerson: null, keyPersonTitle: null, website: null, publiclyKnown: true },
  { name: "Lighthouse Canton India", promoterFamily: "Multi-family office", sourceOfWealth: "Multi-family", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹8,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["PE", "Credit", "VC", "Real Estate"], keyPerson: null, keyPersonTitle: null, website: "lighthousecanton.com", publiclyKnown: true },
  { name: "Waterfield Advisors", promoterFamily: "Multi-family office", sourceOfWealth: "Multi-family", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹50,000+ Cr (advisory)", investsInAlternatives: true, knownAlternativeFocus: ["PE", "Credit", "Real Estate", "VC"], keyPerson: "Soumya Rajan", keyPersonTitle: "Founder & CEO", website: "waterfieldadvisors.com", publiclyKnown: true },
  { name: "Entrust Family Office", promoterFamily: "Multi-family office", sourceOfWealth: "Multi-family", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹15,000+ Cr (advisory)", investsInAlternatives: true, knownAlternativeFocus: ["PE", "Credit", "Structured Products"], keyPerson: "Rajmohan Krishnan", keyPersonTitle: "Founder", website: "entrustfamilyoffice.com", publiclyKnown: true },
  { name: "Alder Capital", promoterFamily: "Multi-family office", sourceOfWealth: "Multi-family", city: "Mumbai", state: "Maharashtra", estimatedAum: "₹2,000+ Cr", investsInAlternatives: true, knownAlternativeFocus: ["Credit", "PE"], keyPerson: null, keyPersonTitle: null, website: null, publiclyKnown: false },
];

export class IndiaFamilyOfficeProvider implements ContactProvider {
  readonly name = "india_family_offices";

  async searchOrganizations(
    query: string,
    filters?: Record<string, unknown>
  ): Promise<OrganizationSearchResult[]> {
    const alternativesOnly = filters?.alternativesOnly as boolean | undefined;
    const state = filters?.state as string | undefined;

    const q = query.toLowerCase();
    let matches = INDIAN_FAMILY_OFFICES.filter((fo) => {
      const textMatch =
        q === "" ||
        fo.name.toLowerCase().includes(q) ||
        fo.promoterFamily.toLowerCase().includes(q) ||
        fo.sourceOfWealth.toLowerCase().includes(q) ||
        fo.knownAlternativeFocus.some((f) => f.toLowerCase().includes(q)) ||
        fo.city.toLowerCase().includes(q);
      const altMatch = alternativesOnly ? fo.investsInAlternatives : true;
      const stateMatch = state
        ? fo.state.toLowerCase().includes(state.toLowerCase())
        : true;
      return textMatch && altMatch && stateMatch;
    });

    if (matches.length === 0 && q.length > 0) {
      matches = INDIAN_FAMILY_OFFICES.filter(
        (fo) =>
          fo.knownAlternativeFocus.some((f) =>
            f.toLowerCase().includes(q)
          ) || fo.sourceOfWealth.toLowerCase().includes(q)
      );
    }

    return matches.map(toOrgResult);
  }

  async searchContacts(
    organizationName: string,
    _titles?: string[]
  ): Promise<ContactSearchResult[]> {
    const fo = INDIAN_FAMILY_OFFICES.find(
      (r) =>
        r.name.toLowerCase().includes(organizationName.toLowerCase()) ||
        r.promoterFamily.toLowerCase().includes(organizationName.toLowerCase())
    );
    if (!fo) return [];

    if (fo.keyPerson) {
      return [
        {
          name: fo.keyPerson,
          title: fo.keyPersonTitle,
          email: null,
          emailConfidence: 0,
          linkedinUrl: null,
          organizationName: fo.name,
          rawData: {
            promoterFamily: fo.promoterFamily,
            note: "Email requires enrichment via Apollo/Hunter/LinkedIn",
          },
        },
      ];
    }

    return [
      {
        name: `Principal at ${fo.name}`,
        title: "Family Office Principal",
        email: null,
        emailConfidence: 0,
        linkedinUrl: null,
        organizationName: fo.name,
        rawData: {
          promoterFamily: fo.promoterFamily,
          note: "Key contact not publicly known — use LinkedIn/Apollo for discovery",
        },
      },
    ];
  }

  async enrichContact(): Promise<ContactEnrichmentResult | null> {
    return null;
  }
}

function toOrgResult(fo: FamilyOfficeRecord): OrganizationSearchResult {
  return {
    name: fo.name,
    domain: fo.website,
    industry: "Family Office",
    employeeCount: null,
    location: `${fo.city}, ${fo.state}, India`,
    description: `${fo.promoterFamily} family office. Source of wealth: ${fo.sourceOfWealth}. Est. AUM: ${fo.estimatedAum}. Alternatives focus: ${fo.knownAlternativeFocus.join(", ")}`,
    rawData: {
      promoterFamily: fo.promoterFamily,
      sourceOfWealth: fo.sourceOfWealth,
      estimatedAum: fo.estimatedAum,
      investsInAlternatives: fo.investsInAlternatives,
      knownAlternativeFocus: fo.knownAlternativeFocus,
      keyPerson: fo.keyPerson,
      publiclyKnown: fo.publiclyKnown,
      source: "Public reports, news articles, SEBI filings",
    },
  };
}
