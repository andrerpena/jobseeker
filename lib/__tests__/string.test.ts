import { decodeFromHex, encodeToHex, replaceAll } from "../string";

describe("string", () => {
  describe("replaceAll", () => {
    it("should work", () => {
      const result = replaceAll("andre is a very nice guy", "nice", "cool");
      expect(result).toEqual("andre is a very cool guy");
    });
    it("should replace multiple occurrences", () => {
      const result = replaceAll(
        "andre is a very very nice guy",
        "nice",
        "cool"
      );
      expect(result).toEqual("andre is a very very cool guy");
    });
    it("should weird characters", () => {
      const result = replaceAll(".,?%", "?", "wow");
      expect(result).toEqual(".,wow%");
    });
    it("should work when cannot find", () => {
      const result = replaceAll("cannot find", "andre", "something else");
      expect(result).toEqual("cannot find");
    });
  });
  describe("encodeToHex", () => {
    it("should work", () => {
      const encoded = encodeToHex("andre is cool");
      expect(encoded).toEqual("616e64726520697320636f6f6c");
    });
  });
  describe("decodeFromHex", () => {
    it("should work", () => {
      const decoded = decodeFromHex("616e64726520697320636f6f6c");
      expect(decoded).toEqual("andre is cool");
    });
  });
});
