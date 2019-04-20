import { BotManager } from "./lib/bot-manager";
import { Stackoverflow } from "./bots/stackoverflow";
import { WeWorkRemotely } from "./bots/weworkremotely";
import { AuthenticJobs } from "./bots/authenticJobs";

const botManager = new BotManager();
botManager.register(new AuthenticJobs());
botManager.register(new Stackoverflow());
botManager.register(new WeWorkRemotely());
botManager
  .run()
  .catch(ex => console.log(ex))
  .then(() => {
    console.log("awesome");
    process.exit(0);
  });
