import { BotLogger, Logger } from "./logger";
import colors from "colors";
import puppeteer from "puppeteer";
import { JobInput } from "../graphql-types";
import { addCompany, addJob, getCompany } from "./graphql-client";
import { getMarkdownFromHtml } from "./markdown";

const RATE_LIMIT = 10;

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

  getJobDrafts(
    logger: Logger,
    browser: puppeteer.Browser
  ): Promise<Array<JobDraft | null>>;

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

  async processJob(bot: Bot, draft: JobDraft, logger: BotLogger): Promise<any> {
    const browser = await this.browserPromise;
    const page = await browser.newPage();
    logger.logInfo(`Processing: ${draft.link}`);
    try {
      await logger.logInfo("Start processJob");
      await page.goto(draft.link);
      const shouldProceed = await bot.shouldCapture(page);
      if (!shouldProceed) {
        await logger.logInfo(`Ignoring job: ${draft.link}`);
        return;
      }

      const source = bot.getName();
      const title = await bot.getTitle(page);
      const publishedAt = await bot.getUtcPublishedAt(page);
      const description = getMarkdownFromHtml(
        await bot.getDescriptionHtml(page)
      );
      const tags = await bot.getTags(page);
      const locationDetails = await bot.getLocationDetails(page);
      const salaryDetails = await bot.getSalaryDetails(page);
      const companyDetails = await bot.getCompany(page);

      const getCompanyResult = await getCompany({
        id: undefined,
        urlReference: companyDetails.urlReference
      });
      let companyId: string;
      if (getCompanyResult.data.company) {
        companyId = getCompanyResult.data.company.id;
      } else {
        const addCompanyResult = await addCompany({
          input: {
            displayName: companyDetails.displayName,
            url: companyDetails.urlReference
          }
        });
        if (!addCompanyResult.data) {
          await logger.logError(
            `could not add company`,
            addCompanyResult.errors
          );
          return;
        }
        companyId = addCompanyResult.data.addCompany.id;
      }

      if (!companyId) {
        throw Error("COMPANY SHOULD NOT BE NULL");
      }

      const job: JobInput = {
        title,
        description,
        tags,
        companyId,
        publishedAt: publishedAt
          ? publishedAt.toISOString()
          : new Date().toISOString(),
        url: draft.link,
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
        salaryEquity: salaryDetails.equity,
        source
      };

      try {
        const result = await addJob({
          job
        });

        if (result.errors) {
          logger.logError(
            `Could not save job link: ${draft.link}. job object: ${job}`,
            result.errors
          );
        } else {
          logger.logInfo(`Successfully saved job`, result.data);
        }
      } catch (error) {
        logger.logError(
          `Could not save job link: ${draft.link}. Error: ${error}`,
          job
        );
      }
    } catch (error) {
      await logger.logError(error, draft);
    } finally {
      await page.close();
      await logger.logInfo("End processJob");
    }
  }

  async run(): Promise<void> {
    const browser = await this.browserPromise;
    for (let bot of this.bots) {
      const logger = new ConsoleBotLogger(bot.getName());
      await logger.logInfo("Start getJobDrafts");
      let drafts = (await bot.getJobDrafts(logger, browser)).filter(
        i => i !== null
      ) as JobDraft[];
      await logger.logInfo("End getJobDrafts");
      await logger.logInfo(`Jobs found: ${drafts.length}`);
      let counter = 0;
      for (let draft of drafts) {
        if (counter < RATE_LIMIT) {
          const data = await this.processJob(bot, draft, logger);
          if (data) {
            counter++;
            logger.logInfo(`Processed ${counter} jobs`);
          }
        } else {
          break;
        }
      }
    }
  }
}
