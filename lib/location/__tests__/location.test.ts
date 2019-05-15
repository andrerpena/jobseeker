import { extractLocation } from "../index";
import { findInArray } from "../../string";

describe("index.ts", () => {
  describe("extractLocation", () => {
    it("should not have the tag when there is no location tag", () => {
      const locationTag = extractLocation("brazil only please");
      expect(locationTag).toEqual(null);
    });
    it("should get us-only tags from title", () => {
      const locationTag = extractLocation("us residents please");
      expect(locationTag).toEqual({
        countries: ["US"]
      });
    });
    it("should get us-only tags from description", () => {
      const locationTag = extractLocation(
        "This position can be remote, but US based candidates only"
      );
      expect(locationTag).toEqual({ countries: ["US"] });
    });
    it("should work with suffixes", () => {
      const locationTag = extractLocation("this is fooor uk based people");
      expect(locationTag).toEqual({ countries: ["GB"] });
    });
    it("should work with location required", () => {
      const locationTag = extractLocation("hello north america is amazing");
      expect(locationTag).toEqual({ regions: ["North America"] });
    });

    it("should work with north america as us and canada", () => {
      const locationTag = extractLocation("north america");
      expect(locationTag).toEqual({ regions: ["North America"] });
    });
  });
  describe("findInArray", () => {
    it("should work when it exists", () => {
      expect(
        findInArray("this is the united states of america", [
          "united states of america",
          "haha"
        ])
      ).toEqual(true);
    });
    it("should work when it does not exist", () => {
      expect(findInArray("america", ["europe is cool", "jesus"])).toEqual(
        false
      );
    });
  });
});
