import puppeteer from "puppeteer";
import { ConsoleBotLogger } from "../../bot-manager";
import { launchPuppeteer } from "../../puppeteer";
import { RemoteOk } from "../remoteok";

const remoteOk = new RemoteOk();

describe("RemoteOk", () => {
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
      const jobs = await remoteOk.getJobDrafts(
        new ConsoleBotLogger("remote-ok"),
        browser
      );
      expect(jobs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            lint: expect.any(String)
          })
        ])
      );
    });
  });
  describe("getTitle", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://remoteok.io/remote-jobs/73109-remote-sr-ember-developer-dockyard-inc-"
      );
      expect(await remoteOk.getTitle(page)).toEqual("Sr. Ember Developer");
    });
  });
  describe("getDescription", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://remoteok.io/remote-jobs/73109-remote-sr-ember-developer-dockyard-inc-"
      );
      expect(await remoteOk.getDescriptionHtml(page)).toMatchSnapshot();
    });
  });
  describe("getTags", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://remoteok.io/remote-jobs/73109-remote-sr-ember-developer-dockyard-inc-"
      );
      expect(await remoteOk.getTags(page)).toEqual([
        "ember.js",
        "html",
        "css",
        "ruby-on-rails"
      ]);
    });
  });
  describe("getCompanyDetails", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://remoteok.io/remote-jobs/73109-remote-sr-ember-developer-dockyard-inc-"
      );
      expect(await remoteOk.getCompany(page)).toEqual({
        displayName: "DockYard, Inc.",
        imageUrl:
          "https://remoteok.io/assets/jobs/64aeb14843c6e1cd4f4fd33c28c511ca1559147429.png"
      });
    });
    it("should work when there is no image", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://remoteok.io/remote-jobs/73120-remote-senior-rails-engineer-source-coders"
      );
      expect(await remoteOk.getCompany(page)).toEqual({
        displayName: "Source Coders",
        imageUrl: null
      });
    });
  });
  describe("getPublishedAt", () => {
    it("should work", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://remoteok.io/remote-jobs/73109-remote-sr-ember-developer-dockyard-inc-"
      );
      expect(await remoteOk.getUtcPublishedAt(page)).toEqual(
        new Date("1970-01-19T01:05:47.175Z")
      );
    });
  });
  describe("getLocationDetails", () => {
    it("should work for anywhere", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://remoteok.io/remote-jobs/73118-remote-full-stack-developer-mattermost"
      );
      expect(await remoteOk.getLocationDetails(page)).toEqual(
        new Date("1970-01-19T01:05:47.175Z")
      );
    });
    it("should work for US-ONLY", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://remoteok.io/remote-jobs/73109-remote-sr-ember-developer-dockyard-inc-"
      );
      expect(await remoteOk.getLocationDetails(page)).toEqual({
        acceptedCountries: ["US"]
      });
    });
    it("should work for USA", async () => {
      const page = await browser.newPage();
      await page.goto(
        "https://remoteok.io/remote-jobs/73060-remote-account-executive-interview-schedule"
      );
      expect(await remoteOk.getLocationDetails(page)).toEqual({
        acceptedCountries: ["US"]
      });
    });
  });
});
