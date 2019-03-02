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
        "https://stackoverflow.com/jobs/235026/watch-the-video-award-winning-music-software-mixed-in-key?a=1gORJIfaBbjy&so=p&pg=1&offset=1&total=202&r=true",
      draft: { date: "2019-03-02T04:35:08.634Z" }
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
