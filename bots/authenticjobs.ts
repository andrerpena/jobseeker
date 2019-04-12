import {
  Bot,
  CompanyDetails,
  JobDraft,
  LocationDetails,
  SalaryDetails
} from "../lib/bot-manager";
import { BotLogger } from "../lib/logger";
import * as puppeteer from "puppeteer";

export class Authenticjobs implements Bot {
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
    throw new Error("Not implemented");
  }

  async getTags(page: puppeteer.Page): Promise<string[]> {
    throw new Error("Not implemented");
  }

  async getDescriptionHtml(page: puppeteer.Page): Promise<string> {
    throw new Error("Not implemented");
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
    throw new Error("Not implemented");
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
    throw new Error("Not implemented");
  }
}
