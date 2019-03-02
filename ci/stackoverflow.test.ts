import { Stackoverflow } from "../bots/stackoverflow";
import puppeteer from "puppeteer";
import { ConsoleBotLogger } from "../lib/bot-manager";
import { launchPuppeteer } from "../lib/puppeteer";

const JOB_REMOTE_URL_WITHOUT_REMOTE_DETAILS =
  "https://stackoverflow.com/jobs/161106/backend-and-devops-kubernetes-docker-terraform-finetune-learning?so=i&pg=1&offset=-1&r=true";
const JOB_REMOTE_URL_WITH_REMOTE_DETAILS_WITHOUT_SALARY =
  "https://stackoverflow.com/jobs/237999/backend-engineer-routing-navigation-komoot?so=i&pg=1&offset=0&r=true";
const JOB_REMOTE_URL_WITH_SALARY =
  "https://stackoverflow.com/jobs/205657/qa-engineer-remote-bitfinex";
const JOB_NO_REMOTE_URL =
  "https://stackoverflow.com/jobs/173949/big-data-engineer-ultra-tendency?so=i&pg=1&offset=-1";

const stackoverflow = new Stackoverflow();

describe("Stackoverflow", () => {
  let browser: puppeteer.Browser;
  beforeAll(async () => {
    browser = await launchPuppeteer();
  });
  afterAll(async () => {
    return browser.close();
  });
  describe("drafts", () => {
    it("should work", async () => {
      const jobs = await stackoverflow.getJobDrafts(
        new ConsoleBotLogger("stackoverflow"),
        browser
      );
      expect(jobs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            link: expect.any(String),
            draft: expect.objectContaining({
              date: expect.any(Date)
            })
          })
        ])
      );
    });
  });
  describe("shouldCapture", () => {
    it("should work when remote", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_WITH_REMOTE_DETAILS_WITHOUT_SALARY);
      const isRemote = await stackoverflow.shouldCapture(page);
      expect(isRemote).toEqual(true);
    });
    it("should work when NOT remote", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_NO_REMOTE_URL);
      const isRemote = await stackoverflow.shouldCapture(page);
      expect(isRemote).toEqual(false);
    });
  });
  describe("getTitle", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_WITH_REMOTE_DETAILS_WITHOUT_SALARY);
      const title = await stackoverflow.getTitle(page);
      expect(title).toEqual("Backend Engineer - Routing & Navigation");
    });
  });
  describe("getTags", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_WITH_REMOTE_DETAILS_WITHOUT_SALARY);
      const tags = await stackoverflow.getTags(page);
      expect(tags).toEqual([
        "java",
        "amazon-web-services",
        "routing",
        "gis",
        "kotlin"
      ]);
    });
  });
  describe("getDescriptionHtml", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_WITH_REMOTE_DETAILS_WITHOUT_SALARY);
      const description = await stackoverflow.getDescriptionHtml(page);
      expect(description).toMatchSnapshot();
    });
  });
  describe("getLocationDetails", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_WITH_REMOTE_DETAILS_WITHOUT_SALARY);
      const remoteDetails = await stackoverflow.getLocationDetails(page);
      expect(remoteDetails).toEqual({
        preferredLocation: "Berlin",
        preferredTimeZone: 1,
        preferredTimeZoneTolerance: 2,
        raw: "(GMT+01:00) Berlin +/- 2 hours"
      });
    });
    it("should work when there is no remote details", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_WITHOUT_REMOTE_DETAILS);
      const remoteDetails = await stackoverflow.getLocationDetails(page);
      expect(remoteDetails).toEqual({});
    });
  });
  describe("getSalaryDetails", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_WITH_SALARY);
      const salaryDetails = await stackoverflow.getSalaryDetails(page);
      expect(salaryDetails).toEqual({
        currency: "$",
        equity: false,
        max: 60000,
        min: 35000,
        raw:
          "                                $35k - 60k                            "
      });
    });
    it("should work when there is no salary", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_WITH_REMOTE_DETAILS_WITHOUT_SALARY);
      const salaryDetails = await stackoverflow.getSalaryDetails(page);
      expect(salaryDetails).toEqual({});
    });
  });
  describe("getCompany", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_WITH_SALARY);
      const company = await stackoverflow.getCompany(page);
      expect(company).toEqual({
        displayName: "Bitfinex",
        urlReference: "https://stackoverflow.com/jobs/companies/bitfinex"
      });
    });
  });
});
