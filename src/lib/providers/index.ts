import type { ContactProvider } from "./types";
import { ApolloProvider } from "./apollo/client";
import { RocketReachProvider } from "./rocketreach/client";
import { SebiAifProvider } from "./sebi/client";
import { IndiaFamilyOfficeProvider } from "./india-fo/client";
import { MockProvider } from "./mock/client";

export type { ContactProvider, OrganizationSearchResult, ContactSearchResult, ContactEnrichmentResult } from "./types";

export function createProvider(name: "apollo" | "rocketreach" | "sebi_aif" | "india_family_offices" | "mock"): ContactProvider {
  switch (name) {
    case "apollo": {
      const key = process.env.APOLLO_API_KEY;
      if (!key) throw new Error("APOLLO_API_KEY is not set");
      return new ApolloProvider(key);
    }
    case "rocketreach": {
      const key = process.env.ROCKETREACH_API_KEY;
      if (!key) throw new Error("ROCKETREACH_API_KEY is not set");
      return new RocketReachProvider(key);
    }
    case "sebi_aif":
      return new SebiAifProvider();
    case "india_family_offices":
      return new IndiaFamilyOfficeProvider();
    case "mock":
      return new MockProvider();
  }
}

export function getProviders(): ContactProvider[] {
  const mode = process.env.PROVIDER_MODE || "mock";
  const providers: ContactProvider[] = [
    new SebiAifProvider(),
    new IndiaFamilyOfficeProvider(),
  ];
  if (mode === "mock") {
    return providers;
  }
  if (process.env.APOLLO_API_KEY) {
    providers.push(new ApolloProvider(process.env.APOLLO_API_KEY));
  }
  if (process.env.ROCKETREACH_API_KEY) {
    providers.push(new RocketReachProvider(process.env.ROCKETREACH_API_KEY));
  }
  return providers;
}
