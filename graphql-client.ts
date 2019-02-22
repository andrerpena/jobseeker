import ApolloClient from "apollo-boost";
import { InsertJob } from "./graphql-types";
import "cross-fetch/polyfill";
import * as graphql from "graphql";
import * as fs from "fs";

const insertCompanyQuery = fs.readFileSync("./insert-job.graphql").toString();

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

client
  .mutate<InsertJob.AddCompany, InsertJob.Variables>({
    mutation: graphql.parse(insertCompanyQuery),
    variables: {
      companyName: "aaa"
    }
  })
  .catch(ex => {
    console.log("CAATCH BITCH");
    console.log(ex);
  })
  .then(result => console.log(result));
