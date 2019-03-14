import { tokenize } from "../tokenizer";

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
