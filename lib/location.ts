// general
const prefixes = ["location", "location:"];
const suffixes = ["only", "residents", "candidates", "based"];

// location specific
const us = ["US", "USA", "U.S.A", "U.S.A", "United States"];
const europe = ["Europe", "EU", "European Union"];
const uk = ["UK", "United Kingdom", "England"];
const northAmerica = ["north america", ...flatten([us, ["canada"]])];
const americas = ["americas", "north south america"];
const emea = ["emea", "europe middle east africa"];
const mena = ["mena", "Middle East North Africa"];
const northAmericaAndEurope = flatten([northAmerica, europe]);
const americasAndEurope = flatten([americas, europe]);
const africa = ["africa"];
const australia = ["australia"];
const oceania = ["oceania"];

export function flatten(input: string[][]): string[] {
  if (input.length === 0) {
    return [];
  }
  if (input.length === 1) {
    return input[0];
  }
  const flattenedChildren = flatten(input.slice(1, input.length));
  const result: string[] = [];
  for (let item of input[0]) {
    for (let child of flattenedChildren) {
      result.push(item.toLowerCase() + " " + child.toLowerCase());
    }
  }
  return result;
}

export function stripText(input: string) {
  let inputProcessed = input.toLowerCase().replace(/[^a-zA-Z ]/g, "");
  // remove prepositions
  inputProcessed = inputProcessed.replace(" or ", " ");
  inputProcessed = inputProcessed.replace(" and ", " ");
  inputProcessed = inputProcessed.replace(" of ", " ");
  return inputProcessed.replace(" & ", " ").replace(/\s+/g, " ");
}

export function findInCombinations(textToFind: string, combinations: string[]) {
  return (
    combinations.findIndex(
      c => stripText(textToFind).indexOf(stripText(c)) !== -1
    ) !== -1
  );
}

export interface LocationTagMatcher {
  locationTag: string;
  combinations: string[];
}

export function extractLocationTag(
  locationRequired: string,
  jobTitle: string,
  jobDescription: string
): string | null {
  const locationRequiredMatchers: LocationTagMatcher[] = [
    {
      locationTag: "north-america-and-europe-only",
      combinations: northAmericaAndEurope
    },
    {
      locationTag: "americas-and-europe-only",
      combinations: americasAndEurope
    },
    {
      locationTag: "north-america-only",
      combinations: northAmerica
    },
    {
      locationTag: "americas-only",
      combinations: americas
    },
    {
      locationTag: "us-only",
      combinations: us
    },
    {
      locationTag: "europe-only",
      combinations: europe
    },
    {
      locationTag: "uk-only",
      combinations: uk
    },
    {
      locationTag: "emea-only",
      combinations: emea
    },
    {
      locationTag: "mena-only",
      combinations: mena
    },
    {
      locationTag: "africa-only",
      combinations: africa
    },
    {
      locationTag: "oceania-only",
      combinations: oceania
    },
    {
      locationTag: "australia-only",
      combinations: australia
    }
  ];

  // process location required
  for (let matcher of locationRequiredMatchers) {
    // process location required
    if (findInCombinations(locationRequired, matcher.combinations)) {
      return matcher.locationTag;
    }
    // process title and body
    if (
      findInCombinations(jobTitle, flatten([prefixes, matcher.combinations])) ||
      findInCombinations(jobTitle, flatten([matcher.combinations, suffixes]))
    ) {
      return matcher.locationTag;
    }
    if (
      findInCombinations(
        jobDescription,
        flatten([prefixes, matcher.combinations])
      ) ||
      findInCombinations(
        jobDescription,
        flatten([matcher.combinations, suffixes])
      )
    ) {
      return matcher.locationTag;
    }
  }
  return null;
}
