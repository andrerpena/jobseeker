import puppeteer from "puppeteer";
import {
  getElementWithExactText,
  getInnerHtmlFromElement,
  getNextElement,
  getTextFromElement,
  launchPuppeteer
} from "../puppeteer";

const html = `
<html>
    <head></head>
    <body>
        <div class="list-1">
            <div class="item">item 1</div>
            <div class="item">item 2</div>
            <div class="item">item 3</div>
        </div>
        <h1>Some header</h1>
    </body>
</html>`;

describe("puppeteer", () => {
  let browser: puppeteer.Browser;
  beforeAll(async () => {
    browser = await launchPuppeteer();
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
  describe("getNextElement", () => {
    it("should work with different element types", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const element = await page.$(".list-1");
      if (!element) {
        throw new Error("element should not be null");
      }
      const nextElement = await getNextElement(page, element);
      const nextElementText = await getTextFromElement(page, nextElement);
      expect(nextElementText).toEqual("Some header");
    });
  });
  describe("getInnerHtml", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const element = await page.$(".list-1");
      if (!element) {
        throw new Error("element was not supposed to be null");
      }
      const innerHtml = await getInnerHtmlFromElement(page, element);
      expect(innerHtml).toEqual(
        '<div class="item">item 1</div>\n' +
          '            <div class="item">item 2</div>\n' +
          '            <div class="item">item 3</div>'
      );
      // list-1
    });
  });
});
