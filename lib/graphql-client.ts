import ApolloClient from "apollo-boost";
import {
  CompanyInput,
  AddCompany,
  AddJob,
  GetCompany,
  JobInput
} from "../graphql-types";
import "cross-fetch/polyfill";
import * as graphql from "graphql";
import * as fs from "fs";
import * as path from "path";

const addCompanyMutation = graphql.parse(
  fs
    .readFileSync(path.join(__dirname, "/graphql/add-company.graphql"))
    .toString()
);
const addJobMutation = graphql.parse(
  fs.readFileSync(path.join(__dirname, "/graphql/add-job.graphql")).toString()
);
const getCompanyQuery = graphql.parse(
  fs
    .readFileSync(path.join(__dirname, "/graphql/get-company.graphql"))
    .toString()
);

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

export function addCompany(variables: AddCompany.Variables) {
  return client.mutate<AddCompany.AddCompany, AddCompany.Variables>({
    mutation: addCompanyMutation,
    variables
  });
}

export function getCompany(variables: GetCompany.Variables) {
  return client.query<GetCompany.Company, GetCompany.Variables>({
    query: getCompanyQuery,
    variables
  });
}

export function addJob(variables: AddJob.Variables) {
  return client.mutate<AddJob.AddJob, AddJob.Variables>({
    mutation: addJobMutation,
    variables
  });
}
