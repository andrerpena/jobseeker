import { BotLogger, Logger } from "./logger";
import colors from "colors";
import * as puppeteer from "puppeteer";

export interface Job {
  title: String;
  tags: string[];
  description: string;
  locationDetails?: LocationDetails;
  salaryDetails?: SalaryDetails;
}

export interface LocationDetails {
  raw: string;
  requiredLocation?: string;
  preferredLocation?: string;
  preferredTimeZone?: number;
  preferredTimeZoneTolerance?: number;
}

export interface SalaryDetails {
  raw: string;
  exact?: number;
  min?: number;
  max?: number;
  currency?: string;
  equity?: boolean;
}

export interface JobDraft {
  link: string;
  draft: object;
}

export interface Bot {
  getName(): string;

  getJobDrafts(logger: Logger): Promise<Array<JobDraft | null>>;

  saveJob(job: Job, logger: Logger): Promise<void>;

  shouldCapture(page: puppeteer.Page): Promise<boolean>;

  getTitle(page: puppeteer.Page): Promise<string>;

  getTags(page: puppeteer.Page): Promise<string[]>;

  getDescription(page: puppeteer.Page): Promise<string>;

  getLocationDetails(
    page: puppeteer.Page
  ): Promise<LocationDetails | undefined>;

  getSalaryDetails(page: puppeteer.Page): Promise<SalaryDetails | undefined>;
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
    try {
      await logger.logInfo("Start processJob");
      await page.goto(draft.link);
      const shouldProceed = await bot.shouldCapture(page);
      if (!shouldProceed) {
        return;
      }

      const title = await bot.getTitle(page);
      const description = await bot.getDescription(page);
      const tags = await bot.getTags(page);
      const locationDetails = await bot.getLocationDetails(page);
      const salaryDetails = await bot.getSalaryDetails(page);

      const job: Job = {
        title,
        description,
        tags,
        locationDetails,
        salaryDetails
      };

      await bot.saveJob(job, logger);
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
