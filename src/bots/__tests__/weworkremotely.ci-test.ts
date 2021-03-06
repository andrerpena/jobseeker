import puppeteer from "puppeteer";
import { ConsoleBotLogger } from "../../bot-manager";
import { launchPuppeteer } from "../../puppeteer";
import { WeWorkRemotely } from "../weworkremotely";
import { LocationDetailsInput } from "../../../graphql-types";

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
      await page.goto(
        "https://weworkremotely.com/remote-jobs/helpdocs-full-stack-developer"
      );
      const companyDetails = await weWorkRemotely.getCompany(page, null);
      expect(companyDetails).toEqual({
        displayName: "HelpDocs",
        imageUrl:
          "https://we-work-remotely.imgix.net/logos/0015/6620/logo.gif?ixlib=rails-2.1.3&w=50&h=50&dpr=2&fit=fill&auto=compress"
      });
    });
  });
  describe("getLocationDetails", () => {
    it("should work for USA", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://weworkremotely.com/remote-jobs/hubtran-rails-developer"
      );
      const companyDetails = await weWorkRemotely.getLocationDetails(
        page,
        null
      );

      expect(companyDetails).toEqual({
        acceptedCountries: ["US"]
      } as LocationDetailsInput);
    });
    // skipping because I can't find one specific to north america now
    it.skip("should work for North America", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://weworkremotely.com/remote-jobs/aha-react-ruby-on-rails-engineer"
      );
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
      await page.goto(
        "https://weworkremotely.com/remote-jobs/aha-react-ruby-on-rails-engineer"
      );
      const companyDetails = await weWorkRemotely.getLocationDetails(
        page,
        null
      );
      expect(companyDetails).toEqual({});
    });
  });
});
