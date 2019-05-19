import { WeWorkRemotely } from "../weworkremotely";

const weworkremotely = new WeWorkRemotely();

describe("weworkremotely", () => {
  describe("getLocationFromText", () => {
    it("should work when there is a location", () => {
      const location = weworkremotely.getLocationFromText(
        "Must be located: North America"
      );
      expect(location).toEqual("North America");
    });
    it("should work when there is no location", () => {
      const location = weworkremotely.getLocationFromText("Banana");
      expect(location).toEqual(null);
    });
  });
});
