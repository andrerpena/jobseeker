import {
  conjunctions,
  europe,
  extractLocationTag,
  findInCombinations,
  flatten,
  northAmerica,
  stripText
} from "../location";

describe("location", () => {
  describe("extractLocationTag", () => {
    it("should not have the tag when there is no location tag", () => {
      const locationTag = extractLocationTag(
        "",
        "brazil only please",
        "blablabla"
      );
      expect(locationTag).toEqual(null);
    });
    it("should get us-only tags from title", () => {
      const locationTag = extractLocationTag("", "us only please", "blablabla");
      expect(locationTag).toEqual("us-only");
    });
    it("should get us-only tags from description", () => {
      const locationTag = extractLocationTag(
        "",
        "blablabla",
        "This position can be remote, but US based candidates only"
      );
      expect(locationTag).toEqual("us-only");
    });
    it("should work with suffixes", () => {
      const locationTag = extractLocationTag(
        "",
        "blablabla",
        "this is fooor uk based people"
      );
      expect(locationTag).toEqual("uk-only");
    });
    it("should work with location required", () => {
      const locationTag = extractLocationTag(
        "hello north america is amazing",
        "blablabla",
        "this is fooor uk based people"
      );
      expect(locationTag).toEqual("north-america-only");
    });

    it("should work with north america as us and canada", () => {
      const locationTag = extractLocationTag(
        "this is only for us and canada people",
        "blablabla",
        "this is fooor uk based people"
      );
      expect(locationTag).toEqual("north-america-only");
    });
  });
  describe("stripText", () => {
    it("should remove and, or and duplicate white-spaces", () => {
      expect(stripText("north  america and \n  canada")).toEqual(
        "north america canada"
      );
    });
  });
  describe("findInCombinations", () => {
    it("should work when it exists", () => {
      expect(
        findInCombinations("this is the united states america", [
          "united states of america",
          "haha"
        ])
      ).toEqual(true);
    });
    it("should work when it does not exist", () => {
      expect(
        findInCombinations("america", ["europe is cool", "jesus"])
      ).toEqual(false);
    });
  });
  describe("flatten", () => {
    it("should work", () => {
      expect(flatten([northAmerica, conjunctions, europe])).toEqual([]);
    });
  });
});
