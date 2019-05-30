import { getUrlFromBackgroundImage } from "../css";

describe("css", () => {
  describe("getUrlFromBackgroundImage", () => {
    it("should work", () => {
      const backgroundImage = getUrlFromBackgroundImage(
        'url("https://remoteok.io/assets/jobs/64aeb14843c6e1cd4f4fd33c28c511ca1559147429.png")'
      );
      expect(backgroundImage).toEqual(
        "https://remoteok.io/assets/jobs/64aeb14843c6e1cd4f4fd33c28c511ca1559147429.png"
      );
    });
  });
});
