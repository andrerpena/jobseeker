import { Bot, CompanyDetails, JobDraft, SalaryDetails } from "../bot-manager";
import * as puppeteer from "puppeteer";
import { Logger } from "../logger";
import {
  getAttributeFromElement,
  getInnerHtmlFromElement,
  getTextFromElement
} from "../puppeteer";
import { getMarkdownFromHtml, removeMarkdown } from "../markdown";
import { extractTags } from "../tag-extractor";
import { LocationDetailsInput } from "../../graphql-types";
import { extractLocation } from "../location";

export class WeWorkRemotely implements Bot {
  buildAbsoluteUrl(relativeUrl: string) {
    return `https://weworkremotely.com${relativeUrl}`;
  }

  getLocationFromText(text: string) {
    const match = text.match(/Must be located:(.*)/);
    if (match) {
      return match[1].trim();
    }
    return null;
  }

  async getCompany(
    page: puppeteer.Page,
    draft: JobDraft | null
  ): Promise<CompanyDetails> {
    const companyNameElement = await page.$(
      ".listing-header-container .company"
    );
    const companyName = await getTextFromElement(page, companyNameElement);

    const companyLogoElement = await page.$(
      ".listing-header .listing-logo img"
    );

    const companyLogoUrl = companyLogoElement
      ? await getAttributeFromElement(page, companyLogoElement, "src")
      : "";

    return {
      displayName: companyName,
      imageUrl: companyLogoUrl
    };
  }

  async getDescriptionHtml(
    page: puppeteer.Page,
    draft: JobDraft | null
  ): Promise<string> {
    const description = await page.$(".listing-container");
    const html = await getInnerHtmlFromElement(page, description);
    if (!html) {
      throw new Error("html was not supposed to be null");
    }
    return html;
  }

  async getJobDrafts(
    logger: Logger,
    browser: puppeteer.Browser
  ): Promise<Array<JobDraft>> {
    const page = await browser.newPage();
    await page.goto(
      "https://weworkremotely.com/categories/remote-programming-jobs"
    );
    const jobSections = await page.$$("section.jobs");
    const jobLists = await Promise.all(
      jobSections.map(async jobSection => {
        const jobElements = await jobSection.$$("ul li > a");
        return Promise.all(
          jobElements.map(async jobElement => {
            const href = await getAttributeFromElement(
              page,
              jobElement,
              "href"
            );
            return {
              link: this.buildAbsoluteUrl(href),
              draft: null
            };
          })
        );
      })
    );
    return jobLists.reduce((p, c) => p.concat(c), []);
  }

  async getLocationDetails(
    page: puppeteer.Page,
    draft: JobDraft | null
  ): Promise<LocationDetailsInput> {
    const regionElement = await page.$(".listing-header-container .region");
    if (regionElement) {
      const locationRaw = await getTextFromElement(page, regionElement);
      const location = this.getLocationFromText(locationRaw);
      const extractedLocation = location ? extractLocation(location) : {};
      return {
        description: locationRaw,
        ...(extractedLocation ? extractedLocation : {})
      };
    }
    return {};
  }

  getName(): string {
    return "we-work-remotely";
  }

  async getSalaryDetails(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<SalaryDetails> {
    return {};
  }

  async getTags(
    page: puppeteer.Page,
    draft: JobDraft | null
  ): Promise<string[]> {
    const descriptionHtml = await this.getDescriptionHtml(page, draft);
    const description = removeMarkdown(getMarkdownFromHtml(descriptionHtml));
    return extractTags(description).map(t => t.name);
  }

  async getTitle(
    page: puppeteer.Page,
    draft: JobDraft | null
  ): Promise<string> {
    const header = await page.$(".listing-header-container h1");
    return (await getTextFromElement(page, header)).trim();
  }

  async getUtcPublishedAt(
    page: puppeteer.Page,
    draft: JobDraft | null
  ): Promise<Date | null> {
    const header = await page.$(".listing-header-container time");
    const dateString = await getAttributeFromElement(page, header, "datetime");
    return new Date(dateString);
  }

  async shouldCapture(page: puppeteer.Page): Promise<boolean> {
    return true;
  }
}
