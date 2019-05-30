import puppeteer from "puppeteer";
import {
  getAttributeFromElement,
  getElementWithExactText,
  getFirstChild,
  getInnerHtmlFromElement,
  getNextElement,
  getTextFromElement,
  launchPuppeteer,
  query,
  selectorExists
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
        <div class="content">
            <span style="background-image: url('https://remote.io/something.png')">I am a span</span>
        </div>
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
  describe("selectorExists", () => {
    it("should return true when selector exists on Page", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      expect(await selectorExists(page, ".list-1")).toEqual(true);
    });
    it("should return null when selector does not exist on Page", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      expect(await selectorExists(page, ".list-2")).toEqual(false);
    });
    it("should return true when selector exists on ElementHandle", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const content = await page.$(".content");
      if (!content) {
        throw new Error(".content does not exist");
      }
      expect(await selectorExists(content, "span")).toEqual(true);
    });
    it("should return null when selector does not exist on Element", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const content = await page.$(".content");
      if (!content) {
        throw new Error(".content does not exist");
      }
      expect(await selectorExists(content, "div")).toEqual(false);
    });
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
  describe("getAttributeFromElement", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const element = await page.$(".list-1 > div:first-child");
      const attribute = await getAttributeFromElement(page, element, "class");
      expect(attribute).toEqual("item");
    });
  });
  describe("getFirstChild", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const element = await page.$(".list-1");
      if (!element) {
        throw new Error("element should not be null");
      }
      const firstChild = await getFirstChild(page, element);
      const text = await getInnerHtmlFromElement(page, firstChild);
      expect(text).toEqual("item 1");
    });
  });
  describe("getComputedStyle", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const backgroundColor = await query(page)
        .$(".content span")
        .getComputedStyle("background-image");
      console.log(backgroundColor);
      if (!backgroundColor) {
        throw new Error("no value");
      }
      expect(backgroundColor.value).toEqual("bla");
    });
  });
});
