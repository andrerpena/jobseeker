import puppeteer from "puppeteer";
import { ConsoleBotLogger } from "../lib/bot-manager";
import { launchPuppeteer } from "../lib/puppeteer";
import { WeWorkRemotely } from "../bots/weworkremotely";

const JOB_REMOTE_URL_MUST_BE_LOCATED_US =
  "https://weworkremotely.com/remote-jobs/elevation-solutions-senior-salesforce-consultant";

const JOB_GOLANG =
  "https://weworkremotely.com/remote-jobs/hashicorp-software-engineer-consul-ecosystem-golang";

const JOB_NORTH_AMERICA =
  "https://weworkremotely.com/remote-jobs/quest-automated-services-database-architect-developer";

const JOB_LOCATION_UNSPECIFIED =
  "https://weworkremotely.com/remote-jobs/gravity-wiz-technical-writer";

const JOB_USA =
  "https://weworkremotely.com/remote-jobs/mondobrain-senior-devops-engineer";

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
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_MUST_BE_LOCATED_US);
      const date = await weWorkRemotely.getUtcPublishedAt(page, null);
      expect(date).toEqual(new Date("2019-03-02T23:41:15.000Z"));
    });
  });
  describe("getDescriptionHtml", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_REMOTE_URL_MUST_BE_LOCATED_US);
      const description = await weWorkRemotely.getDescriptionHtml(page, null);
      expect(description).toEqual(
        "<div>Remote, full-time, up to 25% travel possible<br></div><div></div><div></div><div></div><div><br></div><div>Elevation Solutions focuses on education (Higher Ed and K-12), nonprofit, and provider healthcare organizations to help them transform through the delivery of strategy and technology implementation services. Our consultants play a key role in project delivery, helping bridge the gap between sales, architecture and client user stories. If you are amazing with people, organized, efficient, and really into Salesforce.com, we want to talk to you!<br></div><div></div><div></div><div></div><div><br></div><div><b>Responsibilities</b></div><div><b><br></b></div><ul><li>Lead clients through strategic roadmapping and persona-based discovery initiatives, instilling a sense of partnership, trust, and understanding of the road ahead</li><li><b>Architect best-in-class technology solutions focused on the Salesforce.com ecosystem utilizing persona-based experience requirements as your guide</b></li><li>Drive projects to completion while maintaining focus on and ensuring delivery of original objectives and quantitative results to be achieved</li><li>Manage all project team members, including marketing, build, data, development, and integration team members</li><li>Call out risks when they appear and craft plans to mitigate them</li><li>Manage the preparation and delivery of weekly client status reports and monthly project updates</li><li>Support the company on internal initiatives from time-to-time</li></ul><div><span><br></span></div><div><b>Requirements</b></div><div><b><br></b></div><ul><li>Salesforce Administrator and one Consultant Certification is<span>&nbsp;</span><b>required</b></li><li>Education, nonprofit, and/or healthcare industry experience nice but not required</li><li>Experience as a management consultant on Salesforce engagements would be incredibly helpful for this role</li><li>Knowledge of agile project delivery practices, persona-based requirements gathering, user story prioritization, and solid UAT guidelines</li><li>Excellent time management skills and the ability to prioritize work</li><li>Attention to detail and problem solving skills</li><li>Excellent written and verbal communication skills</li><li>Bachelor’s degree required, MBA a plus</li></ul><div><span><br></span></div><div><b>Other things to know</b><br></div><div></div><div></div><div></div><div><b><br></b></div><div>This job is for a full time position, 100% remote – work from home or coffee shops or wherever you like. We still have a lot of team interaction, though, so you won’t be lonely. You will need an internet connection with bandwidth to support online video conferences.<br></div><div></div><div></div><div></div><div><br></div><div>Work week is generally Monday-Friday and office hours are somewhat flexible. We mostly work between 8 and 5 MST (with reasonable adjustments based on time zone). We offer a flexible vacation policy, 401K enrollment, and the ability for you to participate in our health insurance plan. We do not allow side consulting work; you will need to focus 100% on our clients and growing business. Up to 25% travel may be required based on client needs.</div><div><br></div><div><b>Please apply by sending your resume to admin@elevation.solutions</b></div><div><br></div>"
      );
    });
  });
  describe("getTags", async () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_GOLANG);
      const tags = await weWorkRemotely.getTags(page, null);
      expect(tags).toEqual(["go", "testing", "unix"]);
    });
  });
  describe("getCompany", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_GOLANG);
      const companyDetails = await weWorkRemotely.getCompany(page, null);
      expect(companyDetails).toEqual({
        displayName: "HashiCorp",
        imageUrl:
          "https://we-work-remotely.imgix.net/logos/0015/2171/logo.gif?ixlib=rails-2.1.3&w=190&min-h=150&auto=format",
        url: "https://weworkremotely.com/company/hashicorp"
      });
    });
  });
  describe("getLocationDetails", () => {
    it("should work for USA", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_USA);
      const companyDetails = await weWorkRemotely.getLocationDetails(
        page,
        null
      );
      expect(companyDetails).toEqual({
        raw: "Must be located: U.S.A.",
        requiredLocation: "U.S.A."
      });
    });
    it("should work for North America", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_NORTH_AMERICA);
      const companyDetails = await weWorkRemotely.getLocationDetails(
        page,
        null
      );
      expect(companyDetails).toEqual({
        raw: "Must be located: North America",
        requiredLocation: "North America"
      });
    });
    it("should work when there is no location", async () => {
      const page = await browser.newPage();
      await page.goto(JOB_LOCATION_UNSPECIFIED);
      const companyDetails = await weWorkRemotely.getLocationDetails(
        page,
        null
      );
      expect(companyDetails).toEqual({});
    });
  });
});
