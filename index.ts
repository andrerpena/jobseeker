import { BotManager } from "./src/bot-manager";
import { Stackoverflow } from "./src/bots/stackoverflow";
import { WeWorkRemotely } from "./src/bots/weworkremotely";
import { AuthenticJobs } from "./src/bots/authenticJobs";

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
