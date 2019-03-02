// import { addCompany, addJob, getCompany } from "./lib/graphql-client";
//
// addJob({
//   job: {
//     title: "aaa",
//     publishedAt: new Date().toISOString(),
//     url: "aaaa",
//     description: "awesome",
//     companyId: "zookt-aaa",
//     tags: ["asp.net"],
//     source: "stackoverflow"
//   }
// })
//   .catch(ex => {
//     console.log(ex);
//   })
//   .then(data => {
//     console.log(data);
//   });

import { BotManager, ConsoleBotLogger } from "./lib/bot-manager";
import { Stackoverflow } from "./bots/stackoverflow";

const botManager = new BotManager();
botManager.register(new Stackoverflow());
botManager
  .processJob(
    new Stackoverflow(),
    {
      link:
        "https://stackoverflow.com/jobs/234531/software-developer-academic-analytics?a=1gEzBrsIBGRG&so=p&pg=1&offset=23&total=349&r=true",
      draft: {
        date: "2019-02-28T15:39:30.917Z"
      }
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
