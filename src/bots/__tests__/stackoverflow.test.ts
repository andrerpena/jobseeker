import { Stackoverflow } from "../stackoverflow";

describe("Stackoverflow", () => {
  describe("extractLocationDetailsFromText", () => {
    it("should work without tolerance", () => {
      const remoteDetails = Stackoverflow.extractLocationDetailsFromText(
        "(GMT+00:00) London"
      );
      expect(remoteDetails).toEqual({
        description: "(GMT+00:00) London",
        timeZoneMax: 0,
        timeZoneMin: 0
      });
    });
    it("should work when there is no tolerance specified", () => {
      const remoteDetails = Stackoverflow.extractLocationDetailsFromText(
        "(GMT+11:00) Eastern Time - Melbourne, Sydney"
      );
      expect(remoteDetails).toEqual({
        description: "(GMT+11:00) Eastern Time - Melbourne, Sydney",
        timeZoneMax: 11,
        timeZoneMin: 11
      });
    });
    it("should work with negative numbers", () => {
      const remoteDetails = Stackoverflow.extractLocationDetailsFromText(
        "(GMT-10:00) London"
      );
      expect(remoteDetails).toEqual({
        description: "(GMT-10:00) London",
        timeZoneMax: 10,
        timeZoneMin: 10
      });
    });
    it("should work with negative numbers when there are offsets", () => {
      // (GMT-08:00) Pacific Time +/- 6 hours
      const remoteDetails = Stackoverflow.extractLocationDetailsFromText(
        "(GMT-08:00) Pacific Time +/- 6 hours"
      );
      expect(remoteDetails).toEqual({
        description: "(GMT-08:00) Pacific Time +/- 6 hours",
        timeZoneMax: -2,
        timeZoneMin: -14
      });
    });
    it("when the input is not valid", () => {
      const remoteDetails = Stackoverflow.extractLocationDetailsFromText(
        "(GMT+00:00"
      );
      expect(remoteDetails).toEqual({ description: "(GMT+00:00" });
    });
  });
  describe("extractSalaryDetails", () => {
    it("should work with messed up text", () => {
      const salaryDetails = Stackoverflow.extractSalaryDetails(`
                                $130k - 165k

                                     | 
Equity                            `);

      expect(salaryDetails).toEqual({
        currency: "$",
        equity: true,
        max: 165000,
        min: 130000,
        raw: "$130k - 165k                                     | Equity"
      });
    });
    it("should work without equity", () => {
      const salaryDetails = Stackoverflow.extractSalaryDetails("$50k - 80k ");
      expect(salaryDetails).toEqual({
        currency: "$",
        equity: false,
        max: 80000,
        min: 50000,
        raw: "$50k - 80k"
      });
    });
    it("should work with strange currencies", () => {
      const salaryDetails = Stackoverflow.extractSalaryDetails("BRL50k - 80k ");
      expect(salaryDetails).toEqual({
        currency: "BRL",
        equity: false,
        max: 80000,
        min: 50000,
        raw: "BRL50k - 80k"
      });
    });
    it("should not error with malformed input", () => {
      const salaryDetails = Stackoverflow.extractSalaryDetails("BRL50 - 80k ");
      expect(salaryDetails).toEqual({
        raw: "BRL50 - 80k "
      });
    });
    it("should work with falsy inputs", () => {
      const salaryDetails = Stackoverflow.extractSalaryDetails("");
      expect(salaryDetails).toEqual({
        raw: ""
      });
    });
  });
  describe("getCompanyDetails", () => {});
});
