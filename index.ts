import { BotManager } from "./lib/bot-manager";
import { Stackoverflow } from "./bots/stackoverflow";

const botManager = new BotManager();
botManager.register(new Stackoverflow());
botManager
  .run()
  .catch(ex => console.log(ex))
  .then(() => {
    console.log("awesome");
    process.exit(0);
  });
