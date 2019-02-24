import { getCompany } from "./lib/graphql-client";

getCompany("aaaa").then(result => {
  console.log(result);
});
