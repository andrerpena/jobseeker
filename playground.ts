import { BotManager, ConsoleBotLogger } from "./lib/bot-manager";
import { WeWorkRemotely } from "./bots/weworkremotely";

const botManager = new BotManager();
botManager.register(new WeWorkRemotely());
botManager
  .saveJob(
    new WeWorkRemotely(),
    {
      link:
        "https://weworkremotely.com/remote-jobs/quest-automated-services-database-architect-developer",
      draft: null
    },
    new ConsoleBotLogger("stackoverflow")
  )
  .then(() => {
    console.log("awesome");
    process.exit(0);
  })
  .catch(error => {
    console.log(error);
  });
