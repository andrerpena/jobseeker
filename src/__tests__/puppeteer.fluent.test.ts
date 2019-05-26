import puppeteer from "puppeteer";
import { launchPuppeteer, query } from "../puppeteer";

const html = `
<html>
    <head></head>
    <body>
        <div class="list-1">
            <div class="item">item 1</div>
            <div class="item">item 2</div>
            <div class="item">item 3</div>
            <div class="item-with-children">
                <span data-value="100">I'm a child!</span>
            </div>
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
  describe("getInnerHtml", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const innerHtml = await query(page)
        .$("h1")
        .getInnerHtml();
      expect(innerHtml).toEqual({ error: undefined, value: "Some header" });
    });
    it("should return error when the selector does not exist", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const innerHtml = await query(page)
        .$("h2")
        .getInnerHtml();
      expect(innerHtml).toEqual({
        error: {
          message: "Selector: h2 did not return any element",
          step: 0
        }
      });
    });
    it("should work with nesting", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const innerHtml = await query(page)
        .$(".list-1")
        .$(".item-with-children")
        .$firstChild()
        .getInnerHtml();
      expect(innerHtml).toEqual({
        value: "I'm a child!"
      });
    });
  });
  describe("getAttribute", () => {
    it("should work with nesting", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const innerHtml = await query(page)
        .$(".list-1")
        .$(".item-with-children")
        .$firstChild()
        .getAttribute("data-value");
      expect(innerHtml).toEqual({
        value: "100"
      });
    });
    it("should error when attribute does not exist", async () => {
      const page = await browser.newPage();
      await page.goto(`data:text/html,${html}`);
      const innerHtml = await query(page)
        .$(".list-1")
        .$(".item-with-children")
        .$firstChild()
        .getAttribute("data-valu");
      expect(innerHtml).toEqual({
        error: {
          message: "Could not find attribute data-valu"
        }
      });
    });
  });
});
