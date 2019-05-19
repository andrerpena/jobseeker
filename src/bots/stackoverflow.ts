import {
  Bot,
  CompanyDetails,
  JobDraft,
  SalaryDetails,
  TimezoneDetails
} from "../bot-manager";
import { BotLogger } from "../logger";
import * as puppeteer from "puppeteer";
import {
  getAttributeFromElement,
  getElementWithExactText,
  getInnerHtmlFromElement,
  getNextElement,
  getTextFromElement
} from "../puppeteer";
import { getTimeAgoFromString, getTimeFromTimeAgo } from "../date";
import { removeQueryString } from "../url/url";
import { LocationDetailsInput } from "../../graphql-types";

export class Stackoverflow implements Bot {
  buildAbsoluteUrl(relativeUrl: string) {
    return `https://stackoverflow.com${relativeUrl}`;
  }

  /**
   * Will get a text like (GMT+02:00) Tallinn +/- 6 hours and return timezone
   * details
   * @param locationText
   */
  static extractLocationDetailsFromText(
    locationText: string
  ): LocationDetailsInput {
    const defaultLocation = {
      description: locationText
    } as LocationDetailsInput;

    if (!locationText) {
      return {};
    }
    const normalizedRemoteDetails = locationText.replace(/(\r\n|\n|\r)/gm, "");
    // match should be something like this ["(GMT+00:00) London", "+", "00", "00", "London"]

    // Now, we have some options
    // If the string is like:  "(GMT+01:00) Berlin +/- 4 hours"
    // it will match this Regex: /\(GMT([+,-])(\d+):(\d+)\)\s+(.*)\s+((?:\+\/-) (\d+) hours)/
    // If it is like: "(GMT+00:00) London" it will match another regex

    // https://i.imgur.com/XoTN9ro.png
    const remoteDetailsPattern1Match = normalizedRemoteDetails.match(
      /\(GMT([+,-])(\d+):(\d+)\)\s+(.*)\s+((?:\+\/-) (\d+) hours)/
    );

    if (remoteDetailsPattern1Match) {
      const timeZone = parseInt(remoteDetailsPattern1Match[2]);
      return {
        ...defaultLocation,
        timeZoneMin: timeZone - parseInt(remoteDetailsPattern1Match[6]),
        timeZoneMax: timeZone + parseInt(remoteDetailsPattern1Match[6])
      };
    }

    const remoteDetailsPattern2Match = normalizedRemoteDetails.match(
      /\(GMT([+,-])(\d+):(\d+)\)\s+(.*)/
    );

    if (remoteDetailsPattern2Match) {
      const timeZone = parseInt(remoteDetailsPattern2Match[2]);
      return {
        ...defaultLocation,
        timeZoneMin: timeZone,
        timeZoneMax: timeZone
      };
    }
    return defaultLocation;
  }

  static extractSalaryDetails(salary: string): SalaryDetails {
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
      raw: normalizedSalary ? normalizedSalary.trim() : normalizedSalary,
      currency: match1[1].trim(),
      min: parseFloat(match1[2]) * 1000,
      max: parseFloat(match1[3]) * 1000,
      equity: match1.length > 4 ? !!match1[4] : false
    };
  }

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

  async getLocationDetails(
    page: puppeteer.Page
  ): Promise<LocationDetailsInput> {
    const result: LocationDetailsInput = {};
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
    const preferredTimezoneTitle = await getElementWithExactText(
      remoteDetails,
      "Preferred Timezone:"
    );
    if (preferredTimezoneTitle) {
      const timeZone = await getNextElement(page, preferredTimezoneTitle);
      if (!timeZone) {
        throw new Error("timeZone was not supposed to be null");
      }
      const locationText = await getTextFromElement(page, timeZone);
      return Stackoverflow.extractLocationDetailsFromText(locationText);
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
    return Stackoverflow.extractSalaryDetails(salaryText);
  }

  async getJobDrafts(
    logger: BotLogger,
    browser: puppeteer.Browser
  ): Promise<Array<JobDraft | null>> {
    const page = await browser.newPage();
    await page.goto("https://stackoverflow.com/jobs?r=true&sort=p");
    const jobElements = await page.$$("div[data-jobid]");
    const jobPromises = jobElements.map(async j => {
      const linkElement = await j.$("h2>a");
      if (!linkElement) {
        throw new Error("linkElement was not supposed to be null");
      }
      const dateElement = await j.$("span.ps-absolute:last-child");
      if (!dateElement) {
        throw new Error("dateElement was not supposed to be null");
      }
      const url = await getAttributeFromElement(page, linkElement, "href");
      if (!url) {
        throw new Error("url was not supposed to be null");
      }
      const timeString = await getTextFromElement(page, dateElement);
      if (!timeString) {
        throw new Error("timeString was not supposed to be null");
      }
      return {
        link: removeQueryString(this.buildAbsoluteUrl(url)),
        draft: {
          date: getTimeFromTimeAgo(getTimeAgoFromString(timeString), new Date())
        }
      };
    });
    return Promise.all(jobPromises);
  }

  getName(): string {
    return "stackoverflow";
  }

  async getCompany(page: puppeteer.Page): Promise<CompanyDetails> {
    const overview = await page.$(".job-details--header");
    if (!overview) {
      throw new Error("overview was not supposed to be null");
    }
    const link = await overview.$("a.fc-black-700, a.fc-black-800");
    if (!link) {
      throw new Error("link was not supposed to be null");
    }
    const companyName = await getTextFromElement(page, link);

    if (!companyName) {
      throw new Error("companyName was not supposed to be null");
    }

    const companyImageLink = await overview.$(".s-avatar img");

    const companyImageUrl = companyImageLink
      ? await getAttributeFromElement(page, companyImageLink, "src")
      : "";

    return {
      displayName: companyName,
      imageUrl: companyImageUrl
    };
  }

  async getUtcPublishedAt(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<Date | null> {
    return draft.draft.date;
  }
}
