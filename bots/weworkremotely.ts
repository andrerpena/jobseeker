import {
  Bot,
  CompanyDetails,
  JobDraft,
  LocationDetails,
  SalaryDetails
} from "../lib/bot-manager";
import * as puppeteer from "puppeteer";
import { Logger } from "../lib/logger";
import { getAttributeFromElement, getTextFromElement } from "../lib/puppeteer";

export class WeWorkRemotely implements Bot {
  buildAbsoluteUrl(relativeUrl: string) {
    return `https://weworkremotely.com${relativeUrl}`;
  }

  getCompany(page: puppeteer.Page, draft: JobDraft): Promise<CompanyDetails> {
    return undefined;
  }

  getDescriptionHtml(page: puppeteer.Page, draft: JobDraft): Promise<string> {
    return undefined;
  }

  async getJobDrafts(
    logger: Logger,
    browser: puppeteer.Browser
  ): Promise<Array<JobDraft | null>> {
    const page = await browser.newPage();
    await page.goto("https://weworkremotely.com/");
    const jobSections = await page.$$("section.jobs");
    const jobLists = await Promise.all(
      jobSections.map(async jobSection => {
        const jobElements = await jobSection.$$("ul li a");
        return Promise.all(
          jobElements.map(async jobElement => {
            const href = await getAttributeFromElement(
              page,
              jobElement,
              "href"
            );
            return {
              link: href,
              draft: null
            };
          })
        );
      })
    );
    return jobLists.reduce((p, c) => p.concat(c), []);
  }

  getLocationDetails(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<LocationDetails> {
    return undefined;
  }

  getName(): string {
    return "we-work-remotely";
  }

  getSalaryDetails(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<SalaryDetails> {
    return undefined;
  }

  getTags(page: puppeteer.Page, draft: JobDraft): Promise<string[]> {
    return undefined;
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

  shouldCapture(page: puppeteer.Page): Promise<boolean> {
    return undefined;
  }
}
