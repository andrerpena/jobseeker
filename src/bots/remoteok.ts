import { Bot, CompanyDetails, JobDraft, SalaryDetails } from "../bot-manager";
import { BotLogger } from "../logger";
import * as puppeteer from "puppeteer";
import { query, selectorExists } from "../puppeteer";
import { getMarkdownFromHtml, removeMarkdown } from "../markdown";
import { extractTags } from "../tag-extractor";
import { LocationDetailsInput } from "../../graphql-types";
import { extractLocation } from "../location";
import { getUrlFromBackgroundImage } from "../css";
import { replaceAll } from "../string";

export class RemoteOk implements Bot {
  buildAbsoluteUrl(relativeUrl: string) {
    return `https://remoteok.io${relativeUrl}`;
  }

  async shouldCapture(page: puppeteer.Page): Promise<boolean> {
    return true;
  }

  async getTitle(page: puppeteer.Page): Promise<string> {
    return (
      (await query(page)
        .$("#jobsboard tr .company a[itemprop=url] h2")
        .getInnerText()).value || ""
    );
  }

  async getTags(page: puppeteer.Page): Promise<string[]> {
    const descriptionHtml = await this.getDescriptionHtml(page);
    const description = removeMarkdown(getMarkdownFromHtml(descriptionHtml));
    return extractTags(description).map(t => t.name);
  }

  async getDescriptionHtml(page: puppeteer.Page): Promise<string> {
    return (
      (await query(page)
        .$("#jobsboard .expand .description")
        .getInnerHtml()).value || ""
    );
  }

  async getLocationDetails(
    page: puppeteer.Page
  ): Promise<LocationDetailsInput> {
    const locationToolTipNode = await query(page)
      .$(".location.tooltip")
      .getInnerHtml();
    if (!locationToolTipNode.error && locationToolTipNode.value) {
      return (
        extractLocation(
          replaceAll(locationToolTipNode.value, "-", " "),
          false
        ) || {}
      );
    }
    return {};
  }

  async getSalaryDetails(page: puppeteer.Page): Promise<SalaryDetails> {
    return {};
  }

  async getJobDrafts(
    logger: BotLogger,
    browser: puppeteer.Browser
  ): Promise<Array<JobDraft | null>> {
    const page = await browser.newPage();
    await page.goto("https://remoteok.io/remote-dev-jobs");
    const jobs = await page.$$("#jobsboard tr.job");
    return Promise.all(
      jobs.map(async jobElement => {
        if (!selectorExists(jobElement, ".original")) {
          return null;
        }
        const jobFluentNode = query(page).$element(jobElement);
        const url =
          (await jobFluentNode
            .$(".company a[itemprop=url]")
            .getAttribute("href")).value || "";
        return {
          link: this.buildAbsoluteUrl(url)
        };
      })
    );
  }

  getName(): string {
    return "remote-ok";
  }

  async getCompany(page: puppeteer.Page): Promise<CompanyDetails> {
    const companyNameNode = await query(page)
      .$("#jobsboard .company a[itemprop=hiringOrganization] h3")
      .getInnerHtml();
    const companyUrlNode = await query(page)
      .$("#jobsboard .image.has-logo a div")
      .getComputedStyle("background-image");

    if (companyNameNode.error || !companyNameNode.value) {
      throw new Error("Could not get company name for RemoteOK");
    }

    return {
      displayName: companyNameNode.value.trim(),
      imageUrl: companyUrlNode.value
        ? getUrlFromBackgroundImage(companyUrlNode.value)
        : null
    };
  }

  async getUtcPublishedAt(page: puppeteer.Page): Promise<Date | null> {
    const timeNode = await query(page)
      .$("tr.job")
      .getAttribute("data-epoch");
    if (!timeNode.error && timeNode.value) {
      return new Date(parseInt(timeNode.value) * 1000);
    }
    return null;
  }
}
