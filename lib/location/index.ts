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
  regions?: Region[];
  /**
   * ISO 3166-2 countries
   */
  countries?: string[];
  worldwide?: boolean;
}

// general
const prefixes = ["index.ts", "location:"];
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
      regions: ["North America", "Europe"]
    },
    combinations: northAmericaAndEurope
  },
  {
    location: {
      regions: ["Europe"],
      countries: ["US"]
    },
    combinations: usAndEurope
  },
  {
    location: {
      regions: ["Americas", "Europe"]
    },
    combinations: americasAndEurope
  },
  {
    location: {
      regions: ["North America"]
    },
    combinations: northAmerica
  },
  {
    location: {
      regions: ["Americas"]
    },
    combinations: americas
  },
  {
    location: {
      countries: ["US"]
    },
    combinations: us
  },
  {
    location: {
      regions: ["Europe"]
    },
    combinations: europe
  },
  {
    location: {
      countries: ["GB"]
    },
    combinations: uk
  },
  {
    location: {
      regions: ["Europe", "Middle East", "Africa"]
    },
    combinations: emea
  },
  {
    location: {
      regions: ["Northern Africa", "Middle East"]
    },
    combinations: mena
  },
  {
    location: {
      regions: ["Africa"]
    },
    combinations: africa
  },
  {
    location: {
      regions: ["Oceania"]
    },
    combinations: oceania
  },
  {
    location: {
      countries: ["AU"]
    },
    combinations: australia
  }
];

/**
 * Inspects the given text and returns ExtractedLocation
 */
export function extractLocation(text: string): ExtractedLocation | null {
  if (!text) return {};

  // worldwide
  if (
    text.toLowerCase().indexOf("worldwide") !== -1 ||
    text.toLowerCase().indexOf("anywhere") !== -1
  ) {
    return {
      worldwide: true
    };
  }

  // process location required
  for (let matcher of locationRequiredMatchers) {
    // process location required
    if (findInArray(text, matcher.combinations)) {
      return matcher.location;
    }
    // process title and body
    if (
      findInArray(text, flatten([prefixes, matcher.combinations])) ||
      findInArray(text, flatten([matcher.combinations, suffixes]))
    ) {
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
