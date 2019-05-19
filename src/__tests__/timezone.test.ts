import { getUtcOffsetForLocation } from "../timezone";

describe("timezone", () => {
  describe("getUtcOffsetForLocation", () => {
    it("should work for Lisbon", () => {
      expect(getUtcOffsetForLocation("Lisbon")).toEqual([0]);
    });
    it("should work for Berlin", () => {
      expect(getUtcOffsetForLocation("Berlin")).toEqual([1]);
    });
    it("should work for Germany", () => {
      expect(getUtcOffsetForLocation("Germany")).toEqual([1]);
    });
    it("should work for the United States", () => {
      // when the region has multiple timezones,
      expect(getUtcOffsetForLocation("United States")).toEqual([
        -10,
        -9,
        -8,
        -7,
        -6,
        -5,
        -4
      ]);
    });
    it("should return null for a non-existing region", () => {
      // when the region has multiple timezones,
      expect(getUtcOffsetForLocation("Blablabla")).toEqual(null);
    });
  });
});
