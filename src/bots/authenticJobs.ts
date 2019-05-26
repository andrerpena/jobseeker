import { Bot, CompanyDetails, JobDraft, SalaryDetails } from "../bot-manager";
import { BotLogger } from "../logger";
import * as puppeteer from "puppeteer";
import {
  getAttributeFromElement,
  getInnerHtmlFromElement,
  getTextFromElement
} from "../puppeteer";
import { getMarkdownFromHtml, removeMarkdown } from "../markdown";
import { extractTags } from "../tag-extractor";
import { LocationDetailsInput } from "../../graphql-types";
import { extractLocation } from "../location";

export class AuthenticJobs implements Bot {
  buildAbsoluteUrl(relativeUrl: string) {
    return `https://authenticjobs.com${relativeUrl}`;
  }

  getLocationFromText(text: string) {
    if (text) {
      const processedText = text;
      if (
        processedText === "Anywhere in the world" ||
        processedText === "Anywhere"
      ) {
        return null;
      }
      const match = processedText.match(/Anywhere in (.*)/);
      if (match) {
        return match[1].trim();
      }
      return processedText;
    }
    return null;
  }

  async shouldCapture(page: puppeteer.Page): Promise<boolean> {
    const remoteIcon = await page.$(".ss-wifi");
    return !!remoteIcon;
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
    const title = await this.getTitle(page);
    const description = removeMarkdown(getMarkdownFromHtml(descriptionHtml));
    return extractTags(title + " " + description).map(t => t.name);
  }

  async getDescriptionHtml(page: puppeteer.Page): Promise<string> {
    const description = await page.$("#the_listing .description");
    const html = await getInnerHtmlFromElement(page, description);
    if (!html) {
      throw new Error("html was not supposed to be null");
    }
    return html;
  }

  async getLocationDetails(
    page: puppeteer.Page
  ): Promise<LocationDetailsInput> {
    const description = getMarkdownFromHtml(
      await this.getDescriptionHtml(page)
    );
    const result: LocationDetailsInput =
      extractLocation(description, true) || {};

    let regionElement = await page.$("#location a");
    if (!regionElement) {
      regionElement = await page.$(".ss-location");
    }
    if (regionElement) {
      let locationRaw = await getTextFromElement(page, regionElement);
      if (locationRaw) {
        locationRaw = locationRaw.trim().replace(/(\r\n|\n|\r)/gm, "");
      }
      const location = this.getLocationFromText(locationRaw);
      const extractedLocation = location
        ? extractLocation(location, false)
        : {};

      return {
        ...result,
        description: locationRaw,
        ...(extractedLocation || {})
      };
    }
    return result;
  }

  async getSalaryDetails(page: puppeteer.Page): Promise<SalaryDetails> {
    return {};
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
    const overview = await page.$("#the_company header");
    if (!overview) {
      throw new Error("overview was not supposed to be null");
    }
    const companyNameElement = await overview.$(".headings h1");
    if (!companyNameElement) {
      throw new Error("companyNameElement was not supposed to be null");
    }
    const companyName = await getTextFromElement(page, companyNameElement);

    if (!companyName) {
      throw new Error("companyName was not supposed to be null");
    }

    const companyImageLink = await overview.$("a img");

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
    draft: JobDraft | null
  ): Promise<Date | null> {
    const header = await page.$("#the_listing time");
    const dateString = await getAttributeFromElement(page, header, "datetime");
    const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(dateString);
    return d;
  }
}
