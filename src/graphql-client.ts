import ApolloClient from "apollo-boost";
import {
  CompanyInput,
  AddCompany,
  AddJob,
  GetCompany,
  JobInput,
  GetJob
} from "../graphql-types";
import "cross-fetch/polyfill";
import * as graphql from "graphql";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

config();

const GRAPHQL_AUTH_TOKEN = process.env.GRAPHQL_AUTH_TOKEN;

const getJobQuery = graphql.parse(
  fs.readFileSync(path.join(__dirname, "/queries/get-job.graphql")).toString()
);
const addCompanyMutation = graphql.parse(
  fs
    .readFileSync(path.join(__dirname, "/queries/add-company.graphql"))
    .toString()
);
const addJobMutation = graphql.parse(
  fs.readFileSync(path.join(__dirname, "/queries/add-job.graphql")).toString()
);
const getCompanyQuery = graphql.parse(
  fs
    .readFileSync(path.join(__dirname, "/queries/get-company.graphql"))
    .toString()
);

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  headers: {
    Authorization: GRAPHQL_AUTH_TOKEN
  }
});

export function getJob(variables: GetJob.Variables) {
  return client.query<GetJob.Query, GetJob.Variables>({
    query: getJobQuery,
    variables
  });
}

export function addCompany(variables: AddCompany.Variables) {
  return client.mutate<AddCompany.Mutation, AddCompany.Variables>({
    mutation: addCompanyMutation,
    variables
  });
}

export function getCompany(variables: GetCompany.Variables) {
  return client.query<GetCompany.Query, GetCompany.Variables>({
    query: getCompanyQuery,
    variables
  });
}

export function addJob(variables: AddJob.Variables) {
  return client.mutate<AddJob.Mutation, AddJob.Variables>({
    mutation: addJobMutation,
    variables
  });
}
