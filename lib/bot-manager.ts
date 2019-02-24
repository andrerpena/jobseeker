import { BotLogger, Logger } from "./logger";
import colors from "colors";
import puppeteer from "puppeteer";
import { JobInput } from "../graphql-types";
import { addCompany, addJob, getCompany } from "./graphql-client";
import { getMarkdownFromHtml } from "./markdown";

export interface LocationDetails {
  raw?: string;
  requiredLocation?: string;
  preferredLocation?: string;
  preferredTimeZone?: number;
  preferredTimeZoneTolerance?: number;
}

export interface SalaryDetails {
  raw?: string;
  exact?: number;
  min?: number;
  max?: number;
  currency?: string;
  equity?: boolean;
}

export interface CompanyDetails {
  displayName: string;
  urlReference: string;
}

export interface JobDraft {
  link: string;
  draft: object;
}

export interface Bot {
  getName(): string;

  getJobDrafts(logger: Logger): Promise<Array<JobDraft | null>>;

  shouldCapture(page: puppeteer.Page): Promise<boolean>;

  getTitle(page: puppeteer.Page): Promise<string>;

  getTags(page: puppeteer.Page): Promise<string[]>;

  getDescriptionHtml(page: puppeteer.Page): Promise<string>;

  getUtcPublishedAt(page: puppeteer.Page): Promise<Date | null>;

  getLocationDetails(page: puppeteer.Page): Promise<LocationDetails>;

  getSalaryDetails(page: puppeteer.Page): Promise<SalaryDetails>;

  getCompany(page: puppeteer.Page): Promise<CompanyDetails>;
}

export class ConsoleBotLogger implements BotLogger {
  private botName: string;

  constructor(botName: string) {
    this.botName = botName;
  }

  private log(color: colors.Color, message: string, data?: any) {
    if (data) {
      console.log(
        color(
          `(Bot: ${this.botName}): ${message} - Data: ${JSON.stringify(
            data,
            null,
            4
          )}`
        )
      );
    } else {
      console.log(color(`(Bot: ${this.botName}) ${message}`));
    }
    return Promise.resolve();
  }

  logError(message: string, data?: any) {
    return this.log(colors.red, message, data);
  }

  logInfo(message: string, data?: any) {
    return this.log(colors.green, message, data);
  }
}

export class BotManager {
  bots: Bot[] = [];
  browserPromise: Promise<puppeteer.Browser>;

  constructor() {
    this.browserPromise = puppeteer.launch();
  }

  register(bot: Bot) {
    this.bots.push(bot);
  }

  async processJob(
    bot: Bot,
    draft: JobDraft,
    logger: BotLogger
  ): Promise<void> {
    const browser = await this.browserPromise;
    const page = await browser.newPage();
    logger.logInfo(`Processing: ${draft.link}`);
    try {
      await logger.logInfo("Start processJob");
      await page.goto(draft.link);
      const shouldProceed = await bot.shouldCapture(page);
      if (!shouldProceed) {
        return;
      }

      const title = await bot.getTitle(page);
      const publishedAt = await bot.getUtcPublishedAt(page);
      const description = getMarkdownFromHtml(
        await bot.getDescriptionHtml(page)
      );
      const tags = await bot.getTags(page);
      const locationDetails = await bot.getLocationDetails(page);
      const salaryDetails = await bot.getSalaryDetails(page);
      const companyDetails = await bot.getCompany(page);

      const company = await getCompany({
        id: undefined,
        urlReference: companyDetails.urlReference
      });
      let companyId: string;
      if (company.data) {
        companyId = company.data.id;
      } else {
        const insertedCompany = await addCompany({
          input: {
            displayName: companyDetails.displayName,
            urlReference: companyDetails.urlReference
          }
        });
        if (!insertedCompany.data) {
          await logger.logError(
            `could not add company`,
            insertedCompany.errors
          );
          return;
        }
        companyId = insertedCompany.data.id;
      }

      const job: JobInput = {
        title,
        description,
        tags,
        companyId,
        publishedAt: publishedAt
          ? publishedAt.toISOString()
          : new Date().toISOString(),
        urlReference: draft.link,
        locationRequired: locationDetails.requiredLocation,
        locationPreferred: locationDetails.preferredLocation,
        locationPreferredTimezone: locationDetails.preferredTimeZone,
        locationPreferredTimezoneTolerance:
          locationDetails.preferredTimeZoneTolerance,
        locationRaw: locationDetails.raw,
        salaryRaw: salaryDetails.raw,
        salaryExact: salaryDetails.exact,
        salaryMin: salaryDetails.min,
        salaryMax: salaryDetails.max,
        salaryCurrency: salaryDetails.currency,
        salaryEquity: salaryDetails.equity
      };

      const result = await addJob({
        job
      });

      if (result.errors) {
        logger.logError(`Could not save job: ${draft.link}`, result.errors);
      }
    } catch (error) {
      await logger.logError(error, draft);
    } finally {
      await page.close();
      await logger.logInfo("End processJob");
    }
  }

  async run(): Promise<void> {
    for (let bot of this.bots) {
      const logger = new ConsoleBotLogger(bot.getName());
      await logger.logInfo("Start getJobDrafts");
      let drafts = (await bot.getJobDrafts(logger)).filter(
        i => i !== null
      ) as JobDraft[];
      drafts = drafts.slice(0, 10);
      await logger.logInfo("End getJobDrafts");
      await logger.logInfo(`Jobs found: ${drafts.length}`);
      for (let draft of drafts) {
        await this.processJob(bot, draft, logger);
      }
    }
  }
}
