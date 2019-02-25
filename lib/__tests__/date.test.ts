import { getTimeAgoFromString, getTimeFromTimeAgo } from "../date";

describe("date", () => {
  describe("getTimeAgoFromString", () => {
    it("should work when there is no match", () => {
      const t = getTimeAgoFromString("banana");
      expect(t).toEqual(null);
    });
    it("should work when there is no prefix", () => {
      const t = getTimeAgoFromString("2m ago");
      expect(t).toEqual({
        number: 2,
        prefix: "",
        timeFrame: "m"
      });
    });
    it("should work with prefixes", () => {
      const t = getTimeAgoFromString("> 1h ago");
      expect(t).toEqual({
        number: 1,
        prefix: "> ",
        timeFrame: "h"
      });
    });
  });
  describe("getTimeFromTimeAgo", () => {
    const now = new Date("2010-10-10T10:00:00.000Z");
    it("should work with prefixes", () => {
      const x = getTimeFromTimeAgo(getTimeAgoFromString("> 1d ago"), now);
      expect(x).toEqual(new Date("2010-10-10T10:00:00.000Z"));
    });
    it("should work with hours", () => {
      const x = getTimeFromTimeAgo(getTimeAgoFromString("10h ago"), now);
      expect(x).toEqual(new Date("2010-10-10T00:00:00.000Z"));
    });
    it("should work with days", () => {
      const x = getTimeFromTimeAgo(getTimeAgoFromString("10d ago"), now);
      expect(x).toEqual(new Date("2010-09-30T10:00:00.000Z"));
    });
    it("should work with weeks", () => {
      const x = getTimeFromTimeAgo(getTimeAgoFromString("1w ago"), now);
      expect(x).toEqual(new Date("2010-10-03T10:00:00.000Z"));
    });
  });
});
