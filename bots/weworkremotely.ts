import {
  Bot,
  CompanyDetails,
  JobDraft,
  LocationDetails,
  SalaryDetails
} from "../lib/bot-manager";
import * as puppeteer from "puppeteer";
import { Logger } from "../lib/logger";
import {
  getAttributeFromElement,
  getInnerHtmlFromElement,
  getTextFromElement
} from "../lib/puppeteer";
import { getMarkdownFromHtml, removeMarkdown } from "../lib/markdown";
import { extractTags } from "../lib/tag-extractor";

export class WeWorkRemotely implements Bot {
  buildAbsoluteUrl(relativeUrl: string) {
    return `https://weworkremotely.com${relativeUrl}`;
  }

  async getCompany(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<CompanyDetails> {
    const h2 = await page.$(".listing-header-container");
    const companyNameElement = await page.$(
      ".listing-header-container .company"
    );
    const companyName = await getTextFromElement(page, companyNameElement);
    const companyUrlElement = await h2.$("a:last-child");
    const companyUrl = await getAttributeFromElement(
      page,
      companyUrlElement,
      "href"
    );
    const companyLogoElement = await page.$(
      ".listing-header .listing-logo img"
    );
    const companyLogoUrl = await getAttributeFromElement(
      page,
      companyLogoElement,
      "src"
    );

    return {
      displayName: companyName,
      url: this.buildAbsoluteUrl(companyUrl),
      imageUrl: companyLogoUrl
    };
  }

  async getDescriptionHtml(
    page: puppeteer.Page,
    draft: JobDraft
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
  ): Promise<Array<JobDraft | null>> {
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
    draft: JobDraft
  ): Promise<LocationDetails> {
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

  async getTags(page: puppeteer.Page, draft: JobDraft): Promise<string[]> {
    const descriptionHtml = await this.getDescriptionHtml(page, draft);
    const description = removeMarkdown(getMarkdownFromHtml(descriptionHtml));
    return extractTags(description).map(t => t.name);
  }

  async getTitle(page: puppeteer.Page, draft: JobDraft): Promise<string> {
    const header = await page.$(".listing-header-container h1");
    return getTextFromElement(page, header);
  }

  async getUtcPublishedAt(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<Date | null> {
    const header = await page.$(".listing-header-container time");
    const dateString = await getAttributeFromElement(page, header, "datetime");
    return new Date(dateString);
  }

  async shouldCapture(page: puppeteer.Page): Promise<boolean> {
    return true;
  }
}
