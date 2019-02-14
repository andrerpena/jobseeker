import { Bot, Job, JobDraft } from "../lib/bots";
import Parser from "rss-parser";
import { BotLogger, Logger } from "../lib/logger";

let parser = new Parser();

export class Stackoverflow implements Bot {
  async getJobDrafts(logger: BotLogger): Promise<Array<JobDraft | null>> {
    let feed = await parser.parseURL("https://stackoverflow.com/jobs/feed");
    if (!feed.items) {
      await logger.logError("Feed did not have any items");
      return [];
    }
    return Promise.all(
      feed.items.map(async i => {
        if (!i.link) {
          await logger.logError("stackoverflow", i);
          return null;
        }
        return {
          link: i.link,
          draft: i
        };
      })
    );
  }

  getJob(draft: JobDraft): Promise<Job | null> {
    return Promise.resolve(null);
  }

  saveJob(job: Job): Promise<void> {
    return Promise.resolve();
  }

  getName(): string {
    return "Stackoverflow";
  }
}
