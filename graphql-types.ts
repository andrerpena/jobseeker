export type Maybe<T> = T | null;

export interface JobInput {
  title: string;

  description: string;

  tags: string[];

  publishedAt: string;

  companyId: string;

  locationRaw?: Maybe<string>;

  locationRequired?: Maybe<string>;

  locationPreferred?: Maybe<string>;

  locationPreferredTimezone?: Maybe<number>;

  locationPreferredTimezoneTolerance?: Maybe<number>;

  salaryRaw?: Maybe<string>;

  salaryExact?: Maybe<number>;

  salaryMin?: Maybe<number>;

  salaryMax?: Maybe<number>;

  salaryCurrency?: Maybe<string>;

  salaryEquity?: Maybe<boolean>;

  url: string;
}

export interface CompanyInput {
  displayName: string;

  urlReference: string;
}

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE"
}

/** The `Upload` scalar type represents a file upload promise that resolves an object containing `stream`, `filename`, `mimetype` and `encoding`. */
export type Upload = any;

// ====================================================
// Documents
// ====================================================

export namespace AddCompany {
  export type Variables = {
    input: CompanyInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    addCompany: Maybe<AddCompany>;
  };

  export type AddCompany = {
    __typename?: "Company";

    id: string;
  };
}

export namespace AddJob {
  export type Variables = {
    job: JobInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    addJob: Maybe<AddJob>;
  };

  export type AddJob = {
    __typename?: "Job";

    id: string;
  };
}

export namespace GetCompany {
  export type Variables = {
    id?: Maybe<string>;
    urlReference?: Maybe<string>;
  };

  export type Query = {
    __typename?: "Query";

    company: Maybe<Company>;
  };

  export type Company = {
    __typename?: "Company";

    id: string;
  };
}
