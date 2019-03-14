import { BotManager } from "./lib/bot-manager";
import { Stackoverflow } from "./bots/stackoverflow";
import { WeWorkRemotely } from "./bots/weworkremotely";

const botManager = new BotManager();
botManager.register(new WeWorkRemotely());
botManager.register(new Stackoverflow());
botManager
  .run()
  .catch(ex => console.log(ex))
  .then(() => {
    console.log("awesome");
    process.exit(0);
  });
