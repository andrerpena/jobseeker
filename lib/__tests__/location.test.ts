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
      const locationTag = extractLocationTag(
        "",
        "us residents please",
        "blablabla"
      );
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
        "north america",
        "blablabla",
        "this is fooor uk based people"
      );
      expect(locationTag).toEqual("north-america-only");
    });
  });
  describe("findInCombinations", () => {
    it("should work when it exists", () => {
      expect(
        findInCombinations("this is the united states of america", [
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
      expect(flatten([["a", "b"], conjunctions, ["c", "d"]])).toEqual([
        "a and c",
        "a and d",
        "a or c",
        "a or d",
        "a & c",
        "a & d",
        "b and c",
        "b and d",
        "b or c",
        "b or d",
        "b & c",
        "b & d"
      ]);
    });
  });
});
