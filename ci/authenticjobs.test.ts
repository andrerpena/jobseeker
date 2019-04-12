import puppeteer from "puppeteer";
import { ConsoleBotLogger } from "../lib/bot-manager";
import { launchPuppeteer } from "../lib/puppeteer";
import { AuthenticJobs } from "../bots/authenticJobs";

const authenticJobs = new AuthenticJobs();

const JOB_REMOTE_URL =
  "https://authenticjobs.com/jobs/31311/senior-front-end-developer";

describe("AuthenticJobs", () => {
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
      await page.goto(JOB_REMOTE_URL);
      const title = await authenticJobs.getTitle(page);
      expect(title).toBe("Senior Front End Developer");
    });
  });
  describe("getDescriptionHtml", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL);
      const description = await authenticJobs.getDescriptionHtml(page);
      expect(description).toMatchSnapshot();
    });
  });
  describe("getTags", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL);
      const tags = await authenticJobs.getTags(page);
      expect(tags).toEqual([
        "reactjs",
        "node.js",
        "javascript",
        "html",
        "css",
        "google-maps",
        "sql",
        "elasticsearch",
        "amazon-web-services",
        "jenkins",
        "ios",
        "react-native"
      ]);
    });
  });
  describe("getUtcPublishedAt", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL);
      const date = await authenticJobs.getUtcPublishedAt(page, null);
      expect(date).toEqual(new Date("2019-04-11T19:46:03.000Z"));
    });
  });
});
