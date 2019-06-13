import { BotManager } from "./src/bot-manager";
import { Stackoverflow } from "./src/bots/stackoverflow";
import { WeWorkRemotely } from "./src/bots/weworkremotely";
import { AuthenticJobs } from "./src/bots/authenticJobs";
import { RemoteOk } from "./src/bots/remoteok";
import { config } from "dotenv";

config();

const botManager = new BotManager();
botManager.register(new RemoteOk(), process.env.ENABLE_REMOTE_OK !== "false");
botManager.register(
  new AuthenticJobs(),
  process.env.ENABLE_AUTHENTIC_JOBS !== "false"
);
botManager.register(
  new Stackoverflow(),
  process.env.ENABLE_STACKOVERFLOW !== "false"
);
botManager.register(
  new WeWorkRemotely(),
  process.env.ENABLE_WE_WORK_REMOTELY !== "false"
);
botManager
  .run()
  .catch(ex => console.log(ex))
  .then(() => {
    console.log("awesome");
    process.exit(0);
  });
