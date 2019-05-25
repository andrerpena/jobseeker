import { extractLocation } from "../index";
import { findInArray } from "../../string";

describe("index.ts", () => {
  describe("extractLocation", () => {
    it("should return US if when prefix is not required and US is on the text", () => {
      const locationTag = extractLocation(
        "you have to be in the us please",
        false
      );
      expect(locationTag).toEqual({ acceptedCountries: ["US"] });
    });
    it("should return null if when prefix is required but not passed", () => {
      const locationTag = extractLocation(
        "you have to be in the us please",
        true
      );
      expect(locationTag).toEqual(null);
    });
    it("should return US when prefix is required and passed", () => {
      const locationTag = extractLocation("location: us please", true);
      expect(locationTag).toEqual({ acceptedCountries: ["US"] });
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
