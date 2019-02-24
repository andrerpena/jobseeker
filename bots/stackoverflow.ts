import {
  Bot,
  CompanyDetails,
  JobDraft,
  LocationDetails,
  SalaryDetails
} from "../lib/bot-manager";
import Parser from "rss-parser";
import { BotLogger } from "../lib/logger";
import * as puppeteer from "puppeteer";
import {
  getAttributeFromElement,
  getElementWithExactText,
  getInnerHtmlFromElement,
  getNextElement,
  getTextFromElement
} from "../lib/puppeteer";

let parser = new Parser();

export class Stackoverflow implements Bot {
  buildAbsoluteUrl(relativeUrl: string) {
    return `https://stackoverflow.com${relativeUrl}`;
  }

  extractLocationDetails(remoteDetails: string): LocationDetails {
    const result: LocationDetails = {
      raw: remoteDetails
    };
    if (!remoteDetails) {
      return result;
    }
    const normalizedRemoteDetails = remoteDetails.replace(/(\r\n|\n|\r)/gm, "");
    // match should be something like this ["(GMT+00:00) London", "+", "00", "00", "London"]
    const match1 = normalizedRemoteDetails.match(
      /(?:\(GMT([+,-])(\d+):(\d+)\))\s*(.*)/
    );
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

  extractSalaryDetails(salary: string): SalaryDetails {
    const result: SalaryDetails = {
      raw: salary
    };
    if (!salary) {
      return result;
    }
    const normalizedSalary = salary.replace(/(\r\n|\n|\r)/gm, "");
    const match1 = normalizedSalary.match(
      /([^\d]+)(?:(\d+)k\s+\-\s+(\d+)k)[\s+|]*(Equity)?/
    );
    if (!match1) {
      return result;
    }
    return {
      raw: normalizedSalary,
      currency: match1[1].trim(),
      min: parseFloat(match1[2]) * 1000,
      max: parseFloat(match1[3]) * 1000,
      equity: match1.length > 4 ? !!match1[4] : false
    };
  }

  // refineRemoteDetails(locationDetails: RemoteDetails, jobDescription: string): RemoteDetails {
  //
  // }

  async shouldCapture(page: puppeteer.Page): Promise<boolean> {
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

  async getDescriptionHtml(page: puppeteer.Page): Promise<string> {
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
    return html;
  }

  async getLocationDetails(page: puppeteer.Page): Promise<LocationDetails> {
    const result: LocationDetails = {};
    const overview = await page.$("#overview-items");
    if (!overview) {
      throw new Error("overview was not supposed to be null");
    }
    const remoteDetailsTitle = await getElementWithExactText(
      page,
      "Remote details"
    );
    if (!remoteDetailsTitle) {
      return result;
    }

    const remoteDetails = await getNextElement(page, remoteDetailsTitle);
    if (!remoteDetails) {
      throw new Error("locationDetails was not supposed to be null");
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
    return result;
  }

  async getSalaryDetails(page: puppeteer.Page): Promise<SalaryDetails> {
    const result: SalaryDetails = {};
    const overview = await page.$(".job-details--header ");
    if (!overview) {
      throw new Error("overview was not supposed to be null");
    }
    const salary = await overview.$(".-salary");
    if (!salary) {
      return result;
    }
    const salaryText = await getTextFromElement(page, salary);
    return this.extractSalaryDetails(salaryText);
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

  getName(): string {
    return "Stackoverflow";
  }

  async getCompany(page: puppeteer.Page): Promise<CompanyDetails> {
    const overview = await page.$(".job-details--header");
    if (!overview) {
      throw new Error("overview was not supposed to be null");
    }
    const link = await overview.$("a.fc-black-700");
    if (!link) {
      throw new Error("link was not supposed to be null");
    }
    const companyName = await getTextFromElement(page, link);

    if (!companyName) {
      throw new Error("companyName was not supposed to be null");
    }

    const companyLink = await getAttributeFromElement(page, link, "href");

    if (!companyLink) {
      throw new Error("companyLink was not supposed to be null");
    }

    return {
      urlReference: this.buildAbsoluteUrl(companyLink),
      displayName: companyName
    };
  }

  async getUtcPublishedAt(page: puppeteer.Page): Promise<Date | null> {
    return null;
  }
}
