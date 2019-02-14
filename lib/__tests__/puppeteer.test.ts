import puppeteer from "puppeteer";
import { getElementWithExactText, getTextFromElement } from "../puppeteer";

const html = `
<html>
    <head></head>
    <body>
        <div>
            <div class="item">item 1</div>
            <div class="item">item 2</div>
            <div class="item">item 3</div>
        </div>
    </body>
</html>`;

describe("puppeteer", () => {
  let browser: puppeteer.Browser;
  beforeAll(async () => {
    browser = await puppeteer.launch();
  });
  afterAll(async () => {
    return browser.close();
  });
  describe("getTextFromElement", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const element = await getElementWithExactText(page, "item 1");
      if (!element) {
        throw new Error("element should not be null");
      }
      expect(await getTextFromElement(page, element)).toEqual("item 1");
    });
  });
});
