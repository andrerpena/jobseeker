import { Bot, Job, JobDraft, RemoteDetails, SalaryRange } from "../lib/bots";
import Parser from "rss-parser";
import { BotLogger } from "../lib/logger";
import * as puppeteer from "puppeteer";
import {
  getElementWithExactText,
  getInnerHtmlFromElement,
  getNextElement,
  getTextFromElement
} from "../lib/puppeteer";
import { getMarkdownFromHtml } from "../lib/markdown";

let parser = new Parser();

export class Stackoverflow implements Bot {
  extractLocationDetails(remoteDetails: string): any {
    const result: RemoteDetails = {
      raw: remoteDetails
    };
    // match should be something like this ["(GMT+00:00) London", "+", "00", "00", "London"]
    const match1 = remoteDetails.match(/(?:\(GMT([+,-])(\d+):(\d+)\))\s*(.*)/);
    if (!match1) {
      return result;
    }
    result.preferredTimeZone = parseInt(`${match1[1]}${match1[2]}`);
    const rawLocation = match1[4];
    const match2 = rawLocation.match(/(.*)(?:\+\/-\s+(\d+)\s+hours)/);
    if (!match2) {
      result.preferredLocation = rawLocation;
      return result;
    }
    result.preferredLocation = match2[1].trim();
    result.preferredTimeZoneTolerance = parseInt(match2[2]);
    return result;
  }

  // refineRemoteDetails(remoteDetails: RemoteDetails, jobDescription: string): RemoteDetails {
  //
  // }

  async isRemote(page: puppeteer.Page): Promise<boolean> {
    const jobDetailsHeader = await page.$(".job-details--header");
    if (!jobDetailsHeader) {
      throw new Error("jobDetailsHeader was not supposed to be null");
    }
    const remoteElement = await jobDetailsHeader.$(".-remote");
    return remoteElement !== null;
  }

  async getTitle(page: puppeteer.Page): Promise<string> {
    const jobDetailsHeader = await page.$(".job-details--header");
    if (!jobDetailsHeader) {
      throw new Error("jobDetailsHeader was not supposed to be null");
    }
    const titleElement = await jobDetailsHeader.$(".fs-headline1");
    if (!titleElement) {
      throw new Error("titleElement was not supposed to be null");
    }
    return (await getTextFromElement(page, titleElement)).trim();
  }

  async getTags(page: puppeteer.Page): Promise<string[]> {
    const overview = await page.$("#overview-items");
    if (!overview) {
      throw new Error("overview was not supposed to be null");
    }
    const tags = await overview.$$("a.post-tag");
    return Promise.all(tags.map(t => getTextFromElement(page, t)));
  }

  async getDescription(page: puppeteer.Page) {
    const details = await page.$(".job-details--content");
    if (!details) {
      throw new Error("details was not supposed to be null");
    }
    const descriptionTitle = await getElementWithExactText(
      page,
      "Job description"
    );
    if (!descriptionTitle) {
      throw new Error("descriptionTitle was not supposed to be null");
    }
    const description = await getNextElement(page, descriptionTitle);
    if (!description) {
      throw new Error("description was not supposed to be null");
    }
    const html = await getInnerHtmlFromElement(page, description);
    if (!html) {
      throw new Error("html was not supposed to be null");
    }
    return getMarkdownFromHtml(html);
  }

  async getLocationDetails(
    page: puppeteer.Page
  ): Promise<RemoteDetails | null> {
    const overview = await page.$("#overview-items");
    if (!overview) {
      throw new Error("overview was not supposed to be null");
    }
    const remoteDetailsTitle = await getElementWithExactText(
      page,
      "Remote details"
    );
    if (!remoteDetailsTitle) {
      return null;
    }

    const remoteDetails = await getNextElement(page, remoteDetailsTitle);
    if (!remoteDetails) {
      throw new Error("remoteDetails was not supposed to be null");
    }
    const timeZoneTitle = await getElementWithExactText(
      remoteDetails,
      "Preferred Timezone:"
    );
    if (timeZoneTitle) {
      const timeZone = await getNextElement(page, timeZoneTitle);
      if (!timeZone) {
        throw new Error("timeZone was not supposed to be null");
      }
      const timeZoneText = await getTextFromElement(page, timeZone);
      return this.extractLocationDetails(timeZoneText);
    }
    return null;
  }

  async getSalaryDetails(page: puppeteer.Page): Promise<SalaryRange | null> {
    return null;
  }

  async getJobDrafts(logger: BotLogger): Promise<Array<JobDraft | null>> {
    let feed = await parser.parseURL("https://stackoverflow.com/jobs/feed");
    if (!feed.items) {
      await logger.logError("Feed did not have any items");
      return [];
    }
    return Promise.all(
      feed.items.map(async i => {
        if (!i.link) {
          await logger.logError("stackoverflow", i);
          return null;
        }
        return {
          link: i.link,
          draft: i
        };
      })
    );
  }

  async getJob(page: puppeteer.Page, job: JobDraft): Promise<Job | null> {
    await page.goto(job.link);
    return Promise.resolve(null);

    // title: String;
    // tags: string[];
    // description: string;
    // remoteDetails?: string;
    // salaryRange?: string[];
  }

  async saveJob(job: Job): Promise<void> {
    return Promise.resolve();
  }

  getName(): string {
    return "Stackoverflow";
  }
}
