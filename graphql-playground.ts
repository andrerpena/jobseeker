import { addCompany, addJob, getCompany } from "./lib/graphql-client";

addJob({
  job: {
    title: "aaa",
    publishedAt: new Date().toISOString(),
    urlReference: "aaaa",
    description: "awesome",
    companyId: "zookt-aaa",
    tags: ["asp.net"]
  }
})
  .catch(ex => {
    console.log(ex);
  })
  .then(data => {
    console.log(data);
  });
