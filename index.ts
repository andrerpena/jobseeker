import { BotManager } from "./lib/bot-manager";
import { Stackoverflow } from "./bots/stackoverflow";

const botManager = new BotManager();
botManager.register(new Stackoverflow());
botManager.run();

// puppeteer.launch({ headless: true }).then(async (browser) => {
//   const page = await browser.newPage();
//   await page.goto("https://stackoverflow.ts.com/jobs/202770/javascript-engineer-albelli?so=i&pg=1&offset=-1");
//   const x = await page.evaluate(() => {
//     return document.querySelector("#content > header h1 > a")!.innerHTML;
//   });
//   console.log(x);
//   console.log("all done!");
//   process.exit(0);
// });
