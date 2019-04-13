export type Maybe<T> = T | null;

export interface TagCountGroupInput {
  name: string;

  tags: string[];
}

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

  source: string;
}

export interface CompanyInput {
  displayName: string;

  imageUrl?: Maybe<string>;
}

export interface UpdateSourceInput {
  name: string;

  updateMessage: string;

  updateMessageDetails?: Maybe<string>;
}

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE"
}

/** The `Upload` scalar type represents a file upload. */
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
    displayName: string;
  };

  export type Query = {
    __typename?: "Query";

    getCompany: Maybe<GetCompany>;
  };

  export type GetCompany = {
    __typename?: "Company";

    id: string;
  };
}

export namespace GetJob {
  export type Variables = {
    jobUrl: string;
  };

  export type Query = {
    __typename?: "Query";

    getJob: Maybe<GetJob>;
  };

  export type GetJob = {
    __typename?: "Job";

    id: string;
  };
}
