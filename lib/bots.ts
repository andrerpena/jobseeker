import { BotLogger, Logger } from "./logger";
import colors from "colors";

export interface Job {
  title: String;
  tags: string[];
  description: string;
  remoteDetails?: string;
  salaryRange?: string[];
}

export interface JobDraft {
  link: string;
  draft: object;
}

export interface Bot {
  getName(): string;

  getJobDrafts(logger: Logger): Promise<Array<JobDraft | null>>;

  getJob(draft: JobDraft, logger: Logger): Promise<Job | null>;

  saveJob(job: Job, logger: Logger): Promise<void>;
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

  register(bot: Bot) {
    this.bots.push(bot);
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
        await logger.logInfo("Start getJob");
        const job = await bot.getJob(draft, logger);
        await logger.logInfo("End getJob");
        if (job) {
          await logger.logInfo("Start saveJob");
          await bot.saveJob(job, logger);
          await logger.logInfo("End saveJob");
        }
      }
    }
  }
}
