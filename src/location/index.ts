import { flatten } from "../array";
import { findInArray } from "../string";

export type Region =
  | "Southern Asia"
  | "Asia"
  | "Northern Europe"
  | "Europe"
  | "Southern Europe"
  | "Northern Africa"
  | "Africa"
  | "Caribbean"
  | "Americas"
  | "South America"
  | "Australia and New Zealand"
  | "Oceania"
  | "Western Europe"
  | "Eastern Europe"
  | "Middle Africa"
  | "Sub-Saharan Africa"
  | "South-eastern Asia"
  | "Eastern Asia"
  | "Eastern Africa"
  | "Central America"
  | "Polynesia"
  | "Western Africa"
  | "Southern Africa"
  | "Melanesia"
  | "North America"
  | "Micronesia"
  | "Channel Islands"
  | "Central Asia"
  | "Middle East";

export interface CountryData {
  displayName: string;
  iso31662Name: string;
  regions: Region[];
}

export interface LocationTagMatcher {
  location: ExtractedLocation;
  combinations: string[];
}

export interface ExtractedLocation {
  acceptedRegions?: Region[];
  /**
   * ISO 3166-2 acceptedCountries
   */
  acceptedCountries?: string[];
}

// general
const prefixes = ["only", "location:"];
const suffixes = ["residents", "candidates", "based"];
export const conjunctions = ["and", "or", "&"];

// location specific
const us = ["US", "USA", "U.S.A", "U.S.A", "United States"];
export const europe = ["Europe", "EU", "European Union"];
const uk = ["UK", "United Kingdom", "England"];
export const northAmerica = [
  "north america",
  ...flatten([us, conjunctions, ["canada"]])
];
const americas = ["americas", "north and south america"];
const emea = ["emea", "europe middle east africa"];
const mena = ["mena", "Middle East North Africa"];
const usAndEurope = flatten([us, conjunctions, europe]);
export const northAmericaAndEurope = flatten([
  northAmerica,
  conjunctions,
  europe
]);
const americasAndEurope = flatten([americas, conjunctions, europe]);
const africa = ["africa"];
const australia = ["australia"];
const oceania = ["oceania"];

const locationRequiredMatchers: LocationTagMatcher[] = [
  {
    location: {
      acceptedRegions: ["North America", "Europe"]
    },
    combinations: northAmericaAndEurope
  },
  {
    location: {
      acceptedRegions: ["Europe"],
      acceptedCountries: ["US"]
    },
    combinations: usAndEurope
  },
  {
    location: {
      acceptedRegions: ["Americas", "Europe"]
    },
    combinations: americasAndEurope
  },
  {
    location: {
      acceptedRegions: ["North America"]
    },
    combinations: northAmerica
  },
  {
    location: {
      acceptedRegions: ["Americas"]
    },
    combinations: americas
  },
  {
    location: {
      acceptedCountries: ["US"]
    },
    combinations: us
  },
  {
    location: {
      acceptedRegions: ["Europe"]
    },
    combinations: europe
  },
  {
    location: {
      acceptedCountries: ["GB"]
    },
    combinations: uk
  },
  {
    location: {
      acceptedRegions: ["Europe", "Middle East", "Africa"]
    },
    combinations: emea
  },
  {
    location: {
      acceptedRegions: ["Northern Africa", "Middle East"]
    },
    combinations: mena
  },
  {
    location: {
      acceptedRegions: ["Africa"]
    },
    combinations: africa
  },
  {
    location: {
      acceptedRegions: ["Oceania"]
    },
    combinations: oceania
  },
  {
    location: {
      acceptedCountries: ["AU"]
    },
    combinations: australia
  }
];

/**
 * Inspects the given text and returns ExtractedLocation
 */
export function extractLocation(
  text: string,
  requireSuffixOrPrefix: boolean
): ExtractedLocation | null {
  if (!text) return {};

  // worldwide
  if (
    text.toLowerCase().indexOf("worldwide") !== -1 ||
    text.toLowerCase().indexOf("anywhere") !== -1
  ) {
    return null;
  }

  for (let matcher of locationRequiredMatchers) {
    if (!requireSuffixOrPrefix && findInArray(text, matcher.combinations)) {
      return matcher.location;
    }
    if (
      findInArray(text, flatten([prefixes, matcher.combinations])) ||
      findInArray(text, flatten([matcher.combinations, suffixes]))
    ) {
      return matcher.location;
    }
  }
  return null;
}
