import { addCompany, getCompany } from "./lib/graphql-client";

addCompany({
  input: {
    urlReference: "aa",
    displayName: "aaa"
  }
})
  .catch(ex => {
    console.log(ex);
  })
  .then(data => {
    console.log(data);
  });
