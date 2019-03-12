import puppeteer from "puppeteer";
import { ConsoleBotLogger } from "../lib/bot-manager";
import { launchPuppeteer } from "../lib/puppeteer";
import { WeWorkRemotely } from "../bots/weworkremotely";

const JOB_REMOTE_URL_MUST_BE_LOCATED_US =
  "https://weworkremotely.com/remote-jobs/elevation-solutions-senior-salesforce-consultant";

const weWorkRemotely = new WeWorkRemotely();

describe("WeWorkRemotely", () => {
  jest.setTimeout(30000);

  let browser: puppeteer.Browser;
  beforeAll(async () => {
    browser = await launchPuppeteer();
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
      await page.goto(JOB_REMOTE_URL_MUST_BE_LOCATED_US);
      const title = await weWorkRemotely.getTitle(page, null);
      expect(title).toBe("Senior Salesforce Consultant");
    });
  });
  describe("getUtcPublishedAt", async () => {
    expect(1).toEqual(2);
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_MUST_BE_LOCATED_US);
      const date = await weWorkRemotely.getUtcPublishedAt(page, null);
      expect(date).toEqual(new Date("2019-03-02T23:41:15.000Z"));
    });
  });
});
