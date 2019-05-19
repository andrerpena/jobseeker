import { conjunctions } from "../location";
import { flatten } from "../array";

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
