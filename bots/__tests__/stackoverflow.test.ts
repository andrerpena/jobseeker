import { Stackoverflow } from "../stackoverflow";

const stackoverflow = new Stackoverflow();

describe("Stackoverflow", () => {
  describe("extractTimezoneDetails", () => {
    it("should work without tolerance", () => {
      const remoteDetails = stackoverflow.extractTimezoneDetails(
        "(GMT+00:00) London"
      );
      expect(remoteDetails).toEqual({
        preferredLocation: "London",
        preferredTimeZone: 0,
        raw: "(GMT+00:00) London"
      });
    });
    it("should work when there is no tolerance specified", () => {
      const remoteDetails = stackoverflow.extractTimezoneDetails(
        "(GMT+11:00) Eastern Time - Melbourne, Sydney"
      );
      expect(remoteDetails).toEqual({
        preferredLocation: "Eastern Time - Melbourne, Sydney",
        preferredTimeZone: 11,
        raw: "(GMT+11:00) Eastern Time - Melbourne, Sydney"
      });
    });
    it("should work with negative numbers", () => {
      const remoteDetails = stackoverflow.extractTimezoneDetails(
        "(GMT-10:00) London"
      );
      expect(remoteDetails).toEqual({
        preferredLocation: "London",
        preferredTimeZone: -10,
        raw: "(GMT-10:00) London"
      });
    });
    it("when the input is not valid", () => {
      const remoteDetails = stackoverflow.extractTimezoneDetails("(GMT+00:00");
      expect(remoteDetails).toEqual({ raw: "(GMT+00:00" });
    });
  });
  describe("extractSalaryDetails", () => {
    it("should work with messed up text", () => {
      const salaryDetails = stackoverflow.extractSalaryDetails(`
                                $130k - 165k

                                     | 
Equity                            `);

      expect(salaryDetails).toEqual({
        currency: "$",
        equity: true,
        max: 165000,
        min: 130000,
        raw:
          "                                $130k - 165k                                     | Equity                            "
      });
    });
    it("should work without equity", () => {
      const salaryDetails = stackoverflow.extractSalaryDetails("$50k - 80k ");
      expect(salaryDetails).toEqual({
        currency: "$",
        equity: false,
        max: 80000,
        min: 50000,
        raw: "$50k - 80k "
      });
    });
    it("should work with strange currencies", () => {
      const salaryDetails = stackoverflow.extractSalaryDetails("BRL50k - 80k ");
      expect(salaryDetails).toEqual({
        currency: "BRL",
        equity: false,
        max: 80000,
        min: 50000,
        raw: "BRL50k - 80k "
      });
    });
    it("should not error with malformed input", () => {
      const salaryDetails = stackoverflow.extractSalaryDetails("BRL50 - 80k ");
      expect(salaryDetails).toEqual({
        raw: "BRL50 - 80k "
      });
    });
    it("should work with falsy inputs", () => {
      const salaryDetails = stackoverflow.extractSalaryDetails("");
      expect(salaryDetails).toEqual({
        raw: ""
      });
    });
  });
  describe("getCompanyDetails", () => {});
});
