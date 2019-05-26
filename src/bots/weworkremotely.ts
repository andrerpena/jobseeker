import { Bot, CompanyDetails, JobDraft, SalaryDetails } from "../bot-manager";
import * as puppeteer from "puppeteer";
import { Logger } from "../logger";
import {
  FluentPuppeteerNode,
  getAttributeFromElement,
  getInnerHtmlFromElement,
  getTextFromElement,
  query
} from "../puppeteer";
import { getMarkdownFromHtml, removeMarkdown } from "../markdown";
import { extractTags } from "../tag-extractor";
import { LocationDetailsInput } from "../../graphql-types";
import { extractLocation } from "../location";
import { countries } from "../location/countries";

export class WeWorkRemotely implements Bot {
  buildAbsoluteUrl(relativeUrl: string) {
    return `https://weworkremotely.com${relativeUrl}`;
  }

  async getCompany(
    page: puppeteer.Page,
    draft: JobDraft | null
  ): Promise<CompanyDetails> {
    const company = await query(page)
      .$(".company-card")
      .$("h2 a")
      .getInnerHtml();
    const imageUrl = await query(page)
      .$(".company-card")
      .$(".listing-logo img")
      .getAttribute("src");

    if (company.error) {
      throw company.error;
    }

    if (imageUrl.error) {
      throw imageUrl.error;
    }

    return {
      displayName: company.value || "",
      imageUrl: imageUrl.value || ""
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
    const description = getMarkdownFromHtml(
      await this.getDescriptionHtml(page, draft)
    );

    const resultFromText: LocationDetailsInput =
      extractLocation(description, true) || {};

    // On we-work-remotely, the locations are on the last tags, when they exist,
    const lastTagText = (await query(page)
      .$(".listing-header-container")
      .$lastChild()
      .getInnerHtml()).value;

    const resultFromTag = extractLocation(lastTagText || "", false);

    return {
      ...resultFromText,
      ...resultFromTag
    };
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
