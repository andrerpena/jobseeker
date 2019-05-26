import {
  decodeFromHex,
  encodeToHex,
  hasSpecialCharacters,
  replaceAll,
  tokenize
} from "../string";

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
  describe("hasSpecialCharacters", () => {
    it("should work with spaces", () => {
      const x = hasSpecialCharacters("andre is cool");
      expect(x).toEqual(true);
    });
  });
  describe("tokonizer", () => {
    describe("tokenize", () => {
      it("should work in the simplest case", () => {
        const tokens = tokenize("this is a test");
        expect(tokens).toEqual(["this", "is", "a", "test"]);
      });
      it("should work with capital letters", () => {
        const tokens = tokenize("THIS is A test");
        expect(tokens).toEqual(["this", "is", "a", "test"]);
      });
      it("should work with duplicate spaces", () => {
        const tokens = tokenize("THIS is A    test");
        expect(tokens).toEqual(["this", "is", "a", "test"]);
      });
      it("should remove invalid characters", () => {
        const tokens = tokenize("this-is-something very weird. is'nt it?");
        expect(tokens).toEqual([
          "this-is-something",
          "very",
          "weird",
          "is",
          "nt",
          "it"
        ]);
      });
      it("should remove invalid characters 2", () => {
        const tokens = tokenize("ahauh\n.aah  ,ha,;a");
        expect(tokens).toEqual(["ahauh", "aah", "ha", "a"]);
      });
      it("should remove invalid characters 3", () => {
        const tokens = tokenize("a b.c .d");
        expect(tokens).toEqual(["a", "b", "c", "d"]);
      });
      it("should work with numbers", () => {
        const tokens = tokenize("6173702e6e6574206d7663 is really cool");
        expect(tokens).toEqual([
          "6173702e6e6574206d7663",
          "is",
          "really",
          "cool"
        ]);
      });
    });
  });
});
