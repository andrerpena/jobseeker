import puppeteer from "puppeteer";
import { ConsoleBotLogger } from "../lib/bot-manager";
import { launchPuppeteer } from "../lib/puppeteer";
import { WeWorkRemotely } from "../bots/weworkremotely";

const weWorkRemotely = new WeWorkRemotely();

describe("WeWorkRemotely", () => {
  jest.setTimeout(30000);

  let browser: puppeteer.Browser;
  let jobUrl: string;

  beforeAll(async () => {
    browser = await launchPuppeteer();
    const jobs = await weWorkRemotely.getJobDrafts(
      new ConsoleBotLogger("WeWorkRemotely"),
      browser
    );
    jobUrl = jobs[0].link;
  });
  afterAll(async () => {
    return browser.close();
  });
  describe("drafts", () => {
    it("should work", async () => {
      const jobs = await weWorkRemotely.getJobDrafts(
        new ConsoleBotLogger("WeWorkRemotely"),
        browser
      );
      expect(jobs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            link: expect.any(String),
            draft: null
          })
        ])
      );
    });
  });
  describe("getTitle", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(jobUrl);
      const title = await weWorkRemotely.getTitle(page, null);
      expect(title).toMatch(/.+/);
    });
  });
  describe("getUtcPublishedAt", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(jobUrl);
      const date = await weWorkRemotely.getUtcPublishedAt(page, null);
      expect(date).toBeInstanceOf(Date);
    });
  });
  describe("getDescriptionHtml", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(jobUrl);
      const description = await weWorkRemotely.getDescriptionHtml(page, null);
      expect(description).toMatch(/.+/);
    });
  });
  describe("getTags", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(jobUrl);
      const tags = await weWorkRemotely.getTags(page, null);
      expect(tags).toBeInstanceOf(Array);
    });
  });
  describe("getCompany", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(jobUrl);
      const companyDetails = await weWorkRemotely.getCompany(page, null);
      expect(companyDetails).toEqual({
        displayName: expect.any(String),
        imageUrl: expect.any(String)
      });
    });
  });
  describe("getLocationDetails", () => {
    it("should work for USA", async () => {
      const page = await browser.newPage();
      await page.goto(jobUrl);
      const companyDetails = await weWorkRemotely.getLocationDetails(
        page,
        null
      );
      expect(companyDetails).toEqual({
        raw: expect.any(String),
        requiredLocation: expect.any(String)
      });
    });
    it("should work for North America", async () => {
      const page = await browser.newPage();
      await page.goto(jobUrl);
      const companyDetails = await weWorkRemotely.getLocationDetails(
        page,
        null
      );
      expect(companyDetails).toEqual({
        raw: expect.any(String),
        requiredLocation: expect.any(String)
      });
    });
    it("should work when there is no location", async () => {
      const page = await browser.newPage();
      await page.goto(jobUrl);
      const companyDetails = await weWorkRemotely.getLocationDetails(
        page,
        null
      );
      expect(companyDetails).toEqual({});
    });
  });
});
