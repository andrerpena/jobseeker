import { BotLogger, Logger } from "./logger";
import colors from "colors";
import puppeteer from "puppeteer";
import { JobInput } from "../graphql-types";
import { addCompany, addJob, getCompany, getJob } from "./graphql-client";
import { getMarkdownFromHtml } from "./markdown";
import { launchPuppeteer } from "./puppeteer";
import { extractLocationTag } from "./location";

const RATE_LIMIT = 30;

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
  imageUrl: string;
}

export interface JobDraft {
  link: string;
  draft: any;
}

export interface Bot {
  getName(): string;

  getJobDrafts(
    logger: Logger,
    browser: puppeteer.Browser
  ): Promise<Array<JobDraft | null>>;

  shouldCapture(page: puppeteer.Page): Promise<boolean>;

  getTitle(page: puppeteer.Page, draft: JobDraft): Promise<string>;

  getTags(page: puppeteer.Page, draft: JobDraft): Promise<string[]>;

  getDescriptionHtml(page: puppeteer.Page, draft: JobDraft): Promise<string>;

  getUtcPublishedAt(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<Date | null>;

  getLocationDetails(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<LocationDetails>;

  getSalaryDetails(
    page: puppeteer.Page,
    draft: JobDraft
  ): Promise<SalaryDetails>;

  getCompany(page: puppeteer.Page, draft: JobDraft): Promise<CompanyDetails>;
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
    this.browserPromise = launchPuppeteer();
  }

  register(bot: Bot) {
    this.bots.push(bot);
  }

  async wrapCall<T>(
    call: () => Promise<T>,
    defaultValue: T | null,
    logKey: string,
    url: string,
    logger: BotLogger
  ) {
    try {
      return await call();
    } catch (error) {
      await logger.logError(
        `There was an error processing ${logKey} for URL: ${url}`,
        error
      );
    }
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(
      `The bot failed to return the ${logKey} value for URL ${url}. Aborting`
    );
  }

  async saveJob(bot: Bot, draft: JobDraft, logger: BotLogger): Promise<any> {
    const browser = await this.browserPromise;
    const page = await browser.newPage();
    logger.logInfo(`Processing: ${draft.link}`);
    try {
      await logger.logInfo("Start processJob");
      await page.goto(draft.link);
      const shouldProceed = await this.wrapCall(
        () => bot.shouldCapture(page),
        true,
        "shouldCapture",
        draft.link,
        logger
      );
      if (!shouldProceed) {
        await logger.logInfo(`Ignoring job: ${draft.link}`);
        return;
      }

      const source = bot.getName();
      const title = await this.wrapCall(
        () => bot.getTitle(page, draft),
        null,
        "getTitle",
        draft.link,
        logger
      );

      const publishedAt = await this.wrapCall(
        () => bot.getUtcPublishedAt(page, draft),
        new Date(),
        "getUtcPublishedAt",
        draft.link,
        logger
      );

      const description = getMarkdownFromHtml(
        await this.wrapCall(
          () => bot.getDescriptionHtml(page, draft),
          "getDescriptionHtml",
          null,
          draft.link,
          logger
        )
      );

      const tags = await this.wrapCall(
        () => bot.getTags(page, draft),
        null,
        "getTags",
        draft.link,
        logger
      );

      if (!tags || tags.length === 0) {
        await logger.logInfo(`Ignoring job because of no tags: ${draft.link}`);
        return;
      }

      const locationDetails = await this.wrapCall<LocationDetails>(
        () => bot.getLocationDetails(page, draft),
        {},
        "getLocationDetails",
        draft.link,
        logger
      );

      const salaryDetails = await this.wrapCall<SalaryDetails>(
        () => bot.getSalaryDetails(page, draft),
        {},
        "getSalaryDetails",
        draft.link,
        logger
      );

      const companyDetails = await this.wrapCall(
        () => bot.getCompany(page, draft),
        null,
        "getCompany",
        draft.link,
        logger
      );

      const getCompanyResult = await getCompany({
        displayName: companyDetails.displayName
      });
      let companyId: string;
      if (getCompanyResult.data.getCompany) {
        companyId = getCompanyResult.data.getCompany.id;
      } else {
        const addCompanyResult = await addCompany({
          input: {
            displayName: companyDetails.displayName,
            imageUrl: companyDetails.imageUrl
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

      const locationTag = extractLocationTag(
        locationDetails ? locationDetails.requiredLocation : "",
        title,
        description
      );

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
        locationTag: locationTag,
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
        try {
          if (counter < RATE_LIMIT) {
            logger.logInfo(`counter: ${counter}`);
            const existingJob = await getJob({ jobUrl: draft.link });
            if (existingJob.data.getJob != null) {
              logger.logInfo(
                `Skipping ${draft.link} because it existed already`
              );
              continue;
            }
            const data = await this.saveJob(bot, draft, logger);
            if (data) {
              logger.logInfo(`Processed ${counter} jobs`);
            }
          } else {
            break;
          }
        } finally {
          counter++;
        }
      }
    }
  }
}
