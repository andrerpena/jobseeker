import { Stackoverflow } from "../stackoverflow";

const stackoverflow = new Stackoverflow();

describe("Stackoverflow", () => {
  describe("extractLocationDetails", () => {
    it("should work without tolerance", () => {
      const remoteDetails = stackoverflow.extractLocationDetails(
        "(GMT+00:00) London"
      );
      expect(remoteDetails).toEqual({
        preferredLocation: "London",
        preferredTimeZone: 0,
        raw: "(GMT+00:00) London"
      });
    });
    it("should work when there is no tolerance specified", () => {
      const remoteDetails = stackoverflow.extractLocationDetails(
        "(GMT+11:00) Eastern Time - Melbourne, Sydney"
      );
      expect(remoteDetails).toEqual({
        preferredLocation: "Eastern Time - Melbourne, Sydney",
        preferredTimeZone: 11,
        raw: "(GMT+11:00) Eastern Time - Melbourne, Sydney"
      });
    });
    it("should work with negative numbers", () => {
      const remoteDetails = stackoverflow.extractLocationDetails(
        "(GMT-10:00) London"
      );
      expect(remoteDetails).toEqual({
        preferredLocation: "London",
        preferredTimeZone: -10,
        raw: "(GMT-10:00) London"
      });
    });

    it("when the input is not valid", () => {
      const remoteDetails = stackoverflow.extractLocationDetails("(GMT+00:00");
      expect(remoteDetails).toEqual(null);
    });
  });
});
