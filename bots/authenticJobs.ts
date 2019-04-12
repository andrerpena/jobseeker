import {
  Bot,
  CompanyDetails,
  JobDraft,
  LocationDetails,
  SalaryDetails
} from "../lib/bot-manager";
import { BotLogger } from "../lib/logger";
import * as puppeteer from "puppeteer";
import {
  getAttributeFromElement,
  getInnerHtmlFromElement,
  getTextFromElement
} from "../lib/puppeteer";
import { getMarkdownFromHtml, removeMarkdown } from "../lib/markdown";
import { extractTags } from "../lib/tag-extractor";

export class AuthenticJobs implements Bot {
  buildAbsoluteUrl(relativeUrl: string) {
    return `https://authenticjobs.com${relativeUrl}`;
  }

  extractLocationDetails(remoteDetails: string): LocationDetails {
    throw new Error("Not implemented");
  }

  extractSalaryDetails(salary: string): SalaryDetails {
    throw new Error("Not implemented");
  }

  async shouldCapture(page: puppeteer.Page): Promise<boolean> {
    return true;
  }

  async getTitle(page: puppeteer.Page): Promise<string> {
    const jobDetailsHeader = await page.$(
      "div#content .row.clear-after:first-child"
    );
    if (!jobDetailsHeader) {
      throw new Error("jobDetailsHeader was not supposed to be null");
    }
    const titleElement = await jobDetailsHeader.$(".column h1");
    if (!titleElement) {
      throw new Error("titleElement was not supposed to be null");
    }
    return (await getTextFromElement(page, titleElement)).trim();
  }

  async getTags(page: puppeteer.Page): Promise<string[]> {
    const descriptionHtml = await this.getDescriptionHtml(page);
    const description = removeMarkdown(getMarkdownFromHtml(descriptionHtml));
    return extractTags(description).map(t => t.name);
  }

  async getDescriptionHtml(page: puppeteer.Page): Promise<string> {
    const description = await page.$("#the_listing .description");
    const html = await getInnerHtmlFromElement(page, description);
    if (!html) {
      throw new Error("html was not supposed to be null");
    }
    return html;
  }

  async getLocationDetails(page: puppeteer.Page): Promise<LocationDetails> {
    throw new Error("Not implemented");
  }

  async getSalaryDetails(page: puppeteer.Page): Promise<SalaryDetails> {
    throw new Error("Not implemented");
  }

  async getJobDrafts(
    logger: BotLogger,
    browser: puppeteer.Browser
  ): Promise<Array<JobDraft | null>> {
    const page = await browser.newPage();
    await page.goto("https://authenticjobs.com/#remote=true");
    const jobs = await page.$$(".listedJob a.listing");
    return Promise.all(
      jobs.map(async jobElement => {
        const href = await getAttributeFromElement(page, jobElement, "href");
        return {
          link: this.buildAbsoluteUrl(href),
          draft: null
        };
      })
    );
  }

  getName(): string {
    return "authentic-jobs";
  }

  async getCompany(page: puppeteer.Page): Promise<CompanyDetails> {
    throw new Error("Not implemented");
  }

  async getUtcPublishedAt(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<Date | null> {
    const header = await page.$("#the_listing time");
    const dateString = await getAttributeFromElement(page, header, "datetime");
    const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(dateString);
    return d;
  }
}
