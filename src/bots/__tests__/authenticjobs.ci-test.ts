import puppeteer from "puppeteer";
import { ConsoleBotLogger } from "../../bot-manager";
import { launchPuppeteer } from "../../puppeteer";
import { AuthenticJobs } from "../authenticJobs";

const authenticJobs = new AuthenticJobs();

describe("AuthenticJobs", () => {
  jest.setTimeout(40000);

  let browser: puppeteer.Browser;
  beforeAll(async () => {
    browser = await launchPuppeteer();
  });
  afterAll(async () => {
    return browser.close();
  });
  describe("drafts", () => {
    it("should work", async () => {
      const jobs = await authenticJobs.getJobDrafts(
        new ConsoleBotLogger("authentic-jobs"),
        browser
      );
      expect(jobs.length > 0);
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
      await page.goto(
        "https://authenticjobs.com/jobs/31371/ruby-on-rails-developer"
      );
      const title = await authenticJobs.getTitle(page);
      expect(title).toBe("Ruby on Rails Developer");
    });
  });
  describe("getDescriptionHtml", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://authenticjobs.com/jobs/31371/ruby-on-rails-developer"
      );
      const description = await authenticJobs.getDescriptionHtml(page);
      expect(description).toMatchSnapshot();
    });
  });
  describe("getTags", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://authenticjobs.com/jobs/31371/ruby-on-rails-developer"
      );
      const tags = await authenticJobs.getTags(page);
      expect(tags).toEqual(["ruby-on-rails", "ember.js"]);
    });
  });
  describe("getUtcPublishedAt", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://authenticjobs.com/jobs/31371/ruby-on-rails-developer"
      );
      const date = await authenticJobs.getUtcPublishedAt(page, null);
      expect(date).toEqual(new Date("2019-05-13T18:10:00.000Z"));
    });
  });
  describe("getLocationDetails", () => {
    it("should work anywhere", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://authenticjobs.com/jobs/31371/ruby-on-rails-developer"
      );
      const companyDetails = await authenticJobs.getLocationDetails(page);
      expect(companyDetails).toEqual({
        description: "Anywhere"
      });
    });
    it("should work xxx", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://authenticjobs.com/jobs/31388/inbound-account-executive-100-remote"
      );
      const companyDetails = await authenticJobs.getLocationDetails(page);
      expect(companyDetails).toEqual({
        acceptedCountries: ["US"],
        acceptedRegions: ["North America"],
        description: "East Coast - North America"
      });
    });
  });
});
